// Calcule l'empreinte SHA-256 du mot de passe admin, à mettre dans VITE_ADMIN_PASSWORD_HASH.
// Usage : npm run admin:hash -- "votre-mot-de-passe"
import { createHash } from 'node:crypto';

const password = process.argv[2];
if (!password) {
  console.error('Usage : npm run admin:hash -- "votre-mot-de-passe"');
  process.exit(1);
}
if (password.length < 12) console.warn('Conseil : utilisez au moins 12 caractères.');
console.log(`VITE_ADMIN_PASSWORD_HASH=${createHash('sha256').update(password).digest('hex')}`);
