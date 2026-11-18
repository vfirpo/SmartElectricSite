/**
 * Smart Electric - Utilidades compartidas de autenticación
 * Usadas por todas las Pages Functions de la API.
 *
 * SEGURIDAD:
 *  - El PIN nunca se almacena en texto plano. Se guarda su hash SHA-256 en D1.
 *  - Cada sesión genera un token aleatorio de 64 hex chars (256 bits de entropía).
 *  - Los tokens expiran a las 10 horas y se limpian automáticamente.
 *  - Las rutas de API rechazan cualquier solicitud sin token válido (HTTP 401).
 */

/**
 * Genera el hash SHA-256 de un PIN (string).
 * @param {string} pin
 * @returns {Promise<string>} hex string de 64 caracteres
 */
export async function hashPin(pin) {
  const data = new TextEncoder().encode(String(pin));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Genera un token de sesión aleatorio de 64 caracteres (256 bits).
 * @returns {string}
 */
export function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Valida el token Bearer del header Authorization contra la tabla app_sessions en D1.
 * @param {object} env - Cloudflare env con binding DB
 * @param {Request} request
 * @returns {Promise<boolean>}
 */
export async function validateSession(env, request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  if (!token || token.length < 32) return false;

  try {
    const session = await env.DB.prepare(
      "SELECT token FROM app_sessions WHERE token = ? AND expires_at > datetime('now')"
    ).bind(token).first();
    return !!session;
  } catch {
    return false;
  }
}

/**
 * Respuesta HTTP 401 estándar.
 */
export function unauthorizedResponse(msg = 'No autorizado. Sesión inválida o expirada.') {
  return new Response(JSON.stringify({ error: msg }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Respuesta HTTP 503 cuando D1 no está vinculada.
 */
export function dbNotBoundResponse() {
  return new Response(JSON.stringify({
    error: "Base de datos D1 no vinculada. Verifique el binding 'DB' en Cloudflare Pages."
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}
