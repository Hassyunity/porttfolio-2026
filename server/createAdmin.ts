import { pool } from './db';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: npm run admin:create -- email motdepasse');
  process.exit(1);
}

pool
  .query(
    `insert into blog_admins (email, password_hash)
     values ($1, crypt($2, gen_salt('bf', 12)))
     on conflict (email) do update set password_hash = excluded.password_hash
     returning id, email`,
    [email, password]
  )
  .then((r) => console.log('Admin prêt :', r.rows[0]))
  .catch((e) => console.error(e.message))
  .finally(() => pool.end());
