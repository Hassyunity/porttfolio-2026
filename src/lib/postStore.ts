// Types et validation des articles écrits depuis /admin (stockés dans Supabase, table blog_posts).

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

export const POSTS_TABLE = 'blog_posts';
export const POST_COLUMNS = 'id, slug, title, excerpt, content, tags, status, published_at, created_at, updated_at';
export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const isString = (value: unknown): value is string => typeof value === 'string';
const isDate = (value: unknown) => isString(value) && !Number.isNaN(Date.parse(value));

/** Valide un article venant d'un fichier importé ou de l'ancien stockage du navigateur. */
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

// --- Ancien stockage navigateur (avant Supabase), lu uniquement pour la migration ---
const LEGACY_KEY = 'ht-blog-posts:v1';

export function readLegacyPosts(): PostRow[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(LEGACY_KEY) ?? '[]');
    return Array.isArray(data) ? data.filter(isPostRow) : [];
  } catch {
    return [];
  }
}

export function clearLegacyPosts() {
  try {
    localStorage.removeItem(LEGACY_KEY);
    localStorage.removeItem('ht-blog-posts:last-id');
  } catch { /* stockage indisponible */ }
}
