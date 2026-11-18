-- Ejecutar una única vez contra la base D1 vinculada al proyecto de Cloudflare Pages.
-- No contiene PINs: el valor se escribe hasheado al cambiarlo desde el cotizador.

CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_sessions (
  token TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_app_sessions_expires_at
  ON app_sessions(expires_at);
