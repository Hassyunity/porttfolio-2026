import dotenv from 'dotenv';
import { Pool } from 'pg';

const target = process.env.DB_TARGET === 'vps' ? 'vps' : 'local';
dotenv.config({ path: `server/.env.${target}` });

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error(`DATABASE_URL / JWT_SECRET manquants dans server/.env.${target}`);
}

export const JWT_SECRET = process.env.JWT_SECRET;
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool
  .query('select current_database() db')
  .then((r) => console.log(`[db] cible=${target} base=${r.rows[0].db}`))
  .catch((e) => console.error(`[db] connexion impossible (${target}) :`, e.message));
