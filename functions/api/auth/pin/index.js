/**
 * Cloudflare Pages Function - Cambio de PIN
 * Ruta: POST /api/auth/pin
 * Requiere: Authorization: Bearer <token>
 *
 * Body: { "newPin": "5678" }
 * Respuesta OK: { "success": true }
 */

import { hashPin, validateSession } from '../../../_shared/auth.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Base de datos no disponible.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verificar sesión activa
  const valid = await validateSession(env, request);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'No autorizado. Token inválido o sesión expirada.' }), {
      status: 401,
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

  const newPin = String(body?.newPin ?? '');

  if (!/^\d{4}$/.test(newPin)) {
    return new Response(JSON.stringify({ error: 'El nuevo PIN debe ser de 4 dígitos numéricos.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const hash = await hashPin(newPin);

  try {
    await env.DB.prepare(
      "INSERT OR REPLACE INTO app_config (key, value) VALUES ('pin_hash', ?)"
    ).bind(hash).run();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error al guardar el PIN: ' + e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
