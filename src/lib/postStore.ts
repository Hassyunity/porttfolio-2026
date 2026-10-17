// Stockage des articles écrits depuis /admin, sans serveur :
// - brouillons et articles en cours : localStorage du navigateur de l'admin ;
// - articles en ligne pour tous : fichier public/blog-posts.json, exporté depuis l'admin
//   puis déployé avec le site.

export type PostStatus = 'draft' | 'published';

export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  /** Date de mise en ligne ; dans le futur = article programmé. */
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const SITE_FILE = '/blog-posts.json';

const STORE_KEY = 'ht-blog-posts:v1';
const LAST_ID_KEY = 'ht-blog-posts:last-id';
// Les articles historiques (JSON) utilisent les id 1 à 3 ; on démarre à 1000.
const FIRST_ID = 1000;

const isString = (value: unknown): value is string => typeof value === 'string';
const isDate = (value: unknown) => isString(value) && !Number.isNaN(Date.parse(value));

export function isPostRow(value: unknown): value is PostRow {
  if (!value || typeof value !== 'object') return false;
  const post = value as Record<string, unknown>;
  return Number.isInteger(post.id)
    && isString(post.slug) && SLUG_RE.test(post.slug)
    && isString(post.title) && post.title.trim().length > 0
    && isString(post.excerpt)
    && isString(post.content)
    && Array.isArray(post.tags) && post.tags.every(isString)
    && (post.status === 'draft' || post.status === 'published')
    && (post.published_at === null || isDate(post.published_at))
    && (post.status === 'draft' || post.published_at !== null)
    && isDate(post.created_at)
    && isDate(post.updated_at);
}

/** Article visible par le public : publié et date de mise en ligne atteinte. */
export const isLive = (post: Pick<PostRow, 'status' | 'published_at'>) =>
  post.status === 'published' && post.published_at !== null && Date.parse(post.published_at) <= Date.now();

export function readLocalPosts(): PostRow[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]');
    return Array.isArray(data) ? data.filter(isPostRow) : [];
  } catch {
    return [];
  }
}

/** Lève une erreur si le stockage est plein ou indisponible. */
export function writeLocalPosts(posts: PostRow[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(posts));
  const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
  if (maxId > lastId()) localStorage.setItem(LAST_ID_KEY, String(maxId));
}

function lastId() {
  try { return Number(localStorage.getItem(LAST_ID_KEY)) || FIRST_ID - 1; } catch { return FIRST_ID - 1; }
}

/** Identifiant jamais réutilisé, même après suppression. */
export const nextPostId = (posts: PostRow[]) =>
  Math.max(lastId(), ...posts.map(post => post.id)) + 1;

/** Articles publiés avec le site (public/blog-posts.json). */
export async function fetchSitePosts(): Promise<PostRow[]> {
  try {
    const response = await fetch(SITE_FILE, { cache: 'no-cache' });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? data.filter(isPostRow) : [];
  } catch {
    return [];
  }
}
