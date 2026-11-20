import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { pool, JWT_SECRET } from './db';

const isProd = process.env.NODE_ENV === 'production';
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());

/* ---------- Auth ---------- */
const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10 });

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Champs manquants' });
  try {
    const { rows } = await pool.query(
      `select id, email from blog_admins
       where lower(email) = lower($1) and password_hash = crypt($2, password_hash)`,
      [email, password]
    );
    if (!rows[0]) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = jwt.sign({ sub: String(rows[0].id), email: rows[0].email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('admin_token', token, {
      httpOnly: true, sameSite: 'lax', secure: isProd, maxAge: 7 * 24 * 3600_000,
    });
    res.json({ email: rows[0].email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur base de données' });
  }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true });
});

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  let payload: { sub: string; email: string };
  try {
    payload = jwt.verify(req.cookies?.admin_token, JWT_SECRET) as typeof payload;
  } catch {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  try {
    const { rowCount } = await pool.query('select 1 from blog_admins where id = $1', [payload.sub]);
    if (!rowCount) return res.status(403).json({ error: 'Accès refusé' });
    (req as any).admin = payload;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erreur base de données' });
  }
}

app.get('/api/auth/me', requireAdmin, (req, res) => res.json({ email: (req as any).admin.email }));

/* ---------- Helpers CRUD génériques ---------- */
const colCache = new Map<string, string[]>();
async function columns(table: string): Promise<string[]> {
  if (!colCache.has(table)) {
    const { rows } = await pool.query(
      `select column_name from information_schema.columns
       where table_schema = 'public' and table_name = $1`, [table]);
    colCache.set(table, rows.map((r) => r.column_name));
  }
  return colCache.get(table)!;
}

async function pick(table: string, body: Record<string, unknown>) {
  const cols = await columns(table);
  return Object.entries(body ?? {}).filter(([k]) => cols.includes(k) && k !== 'id');
}

function crud(table: string, orderBy = 'created_at desc') {
  const r = express.Router();

  r.get('/', async (_req, res) => {
    const { rows } = await pool.query(`select * from ${table} order by ${orderBy}`);
    res.json(rows);
  });

  r.get('/:id', async (req, res) => {
    const { rows } = await pool.query(`select * from ${table} where id = $1`, [req.params.id]);
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Introuvable' });
  });

  r.post('/', async (req, res) => {
    const f = await pick(table, req.body);
    const sql = f.length
      ? `insert into ${table} (${f.map(([k]) => `"${k}"`).join(',')}) values (${f.map((_, i) => `$${i + 1}`).join(',')}) returning *`
      : `insert into ${table} default values returning *`;
    const { rows } = await pool.query(sql, f.map(([, v]) => v));
    res.status(201).json(rows[0]);
  });

  r.put('/:id', async (req, res) => {
    const f = await pick(table, req.body);
    if (!f.length) return res.status(400).json({ error: 'Aucun champ' });
    const { rows } = await pool.query(
      `update ${table} set ${f.map(([k], i) => `"${k}" = $${i + 1}`).join(',')}
       where id = $${f.length + 1} returning *`,
      [...f.map(([, v]) => v), req.params.id]
    );
    rows[0] ? res.json(rows[0]) : res.status(404).json({ error: 'Introuvable' });
  });

  r.delete('/:id', async (req, res) => {
    await pool.query(`delete from ${table} where id = $1`, [req.params.id]);
    res.json({ ok: true });
  });

  return r;
}

/* ---------- Routes admin (toutes protégées) ---------- */
const admin = express.Router();
admin.use(requireAdmin);
admin.use('/posts', crud('blog_posts'));
app.use('/api/admin', admin);

/* ---------- Routes publiques (blog) ---------- */
app.get('/api/public/posts', async (_req, res) => {
  const { rows } = await pool.query(
    `select * from blog_posts where published = true order by created_at desc`);
  res.json(rows);
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => console.log(`[api] http://localhost:${port}`));