/**
 * Cloudflare Pages Function - Autenticación por PIN
 * Ruta: POST /api/auth
 *
 * Body: { "pin": "1234" }
 * Respuesta OK: { "token": "<64-hex>", "expiresAt": "..." }
 * Respuesta error: 401 { "error": "PIN incorrecto" }
 */

import { hashPin, generateToken } from '../../_shared/auth.js';

// Hash SHA-256 del PIN por defecto "1234"
const DEFAULT_PIN_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Base de datos no disponible.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo JSON inválido.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const pin = String(body?.pin ?? '');

  // Validar formato: exactamente 4 dígitos
  if (!/^\d{4}$/.test(pin)) {
    return new Response(JSON.stringify({ error: 'El PIN debe ser de 4 dígitos numéricos.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const pinHash = await hashPin(pin);

  // Leer hash almacenado en D1 (tabla app_config, clave 'pin_hash')
  let storedHash = DEFAULT_PIN_HASH;
  try {
    const config = await env.DB.prepare(
      "SELECT value FROM app_config WHERE key = 'pin_hash'"
    ).first();
    if (config?.value) storedHash = config.value;
  } catch {
    // Si la tabla no existe todavía, usa el default
  }

  if (pinHash !== storedHash) {
    // Delay anti-fuerza-bruta (800ms)
    await new Promise(r => setTimeout(r, 800));
    return new Response(JSON.stringify({ error: 'PIN incorrecto.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generar token de sesión (expira en 10 horas)
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000)
    .toISOString()
    .replace('T', ' ')
    .substring(0, 19);

  try {
    // Limpiar sesiones expiradas (housekeeping silencioso)
    await env.DB.prepare(
      "DELETE FROM app_sessions WHERE expires_at < datetime('now')"
    ).run();

    // Registrar nueva sesión
    await env.DB.prepare(
      "INSERT INTO app_sessions (token, expires_at) VALUES (?, ?)"
    ).bind(token, expiresAt).run();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error al crear sesión: ' + e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ token, expiresAt }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
