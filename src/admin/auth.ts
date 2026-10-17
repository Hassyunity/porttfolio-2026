// Accès à /admin par mot de passe, sans serveur.
// Seule l'empreinte SHA-256 du mot de passe est dans le site (VITE_ADMIN_PASSWORD_HASH),
// jamais le mot de passe lui-même. Les articles étant stockés dans le navigateur de l'admin,
// ce verrou sert à garder l'interface privée ; il ne protège pas des données sur un serveur.

export const PASSWORD_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();

const SESSION_KEY = 'ht-admin-session';

export async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/** Session limitée à l'onglet : fermer l'onglet déconnecte. */
export function hasSession() {
  try { return Boolean(PASSWORD_HASH) && sessionStorage.getItem(SESSION_KEY) === PASSWORD_HASH; } catch { return false; }
}

export async function signIn(password: string) {
  const ok = Boolean(PASSWORD_HASH) && (await sha256(password)) === PASSWORD_HASH;
  if (ok) {
    try { sessionStorage.setItem(SESSION_KEY, PASSWORD_HASH); } catch { /* session non mémorisée */ }
  }
  return ok;
}

export function signOut() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* rien à effacer */ }
}
