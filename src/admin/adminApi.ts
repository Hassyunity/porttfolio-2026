import { STATIC_POSTS } from '../data/blog';
import { invalidatePublishedPosts } from '../lib/blogApi';
import { isPostRow, nextPostId, readLocalPosts, writeLocalPosts, type PostRow, type PostStatus } from '../lib/postStore';

export type { PostRow, PostStatus };

/** État éditorial affiché dans l'admin. */
export type PostState = 'draft' | 'scheduled' | 'published';

export interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
}

export const postState = (post: Pick<PostRow, 'status' | 'published_at'>): PostState => {
  if (post.status === 'draft') return 'draft';
  return post.published_at && Date.parse(post.published_at) > Date.now() ? 'scheduled' : 'published';
};

export const STATE_LABEL: Record<PostState, string> = {
  draft: 'Brouillon',
  scheduled: 'Programmé',
  published: 'Publié',
};

// API asynchrone : le stockage pourra passer sur un serveur sans toucher à l'interface.

function save(posts: PostRow[]) {
  try {
    writeLocalPosts(posts);
  } catch {
    throw new Error('Le stockage du navigateur est plein ou bloqué. Exportez une sauvegarde, puis libérez de l\'espace.');
  }
  invalidatePublishedPosts();
}

function assertUniqueSlug(posts: PostRow[], slug: string, id?: number) {
  if (posts.some(post => post.slug === slug && post.id !== id) || STATIC_POSTS.some(post => post.slug === slug)) {
    throw new Error('Ce slug est déjà utilisé par un autre article. Choisissez-en un autre.');
  }
}

const byUpdatedDesc = (a: PostRow, b: PostRow) => Date.parse(b.updated_at) - Date.parse(a.updated_at);

export async function listPosts(): Promise<PostRow[]> {
  return readLocalPosts().sort(byUpdatedDesc);
}

export async function getPost(id: number): Promise<PostRow> {
  const post = readLocalPosts().find(item => item.id === id);
  if (!post) throw new Error('Article introuvable : il a peut-être été supprimé.');
  return post;
}

export async function createPost(input: PostInput): Promise<PostRow> {
  const posts = readLocalPosts();
  assertUniqueSlug(posts, input.slug);
  const now = new Date().toISOString();
  const row: PostRow = { id: nextPostId(posts), ...input, created_at: now, updated_at: now };
  save([...posts, row]);
  return row;
}

export async function updatePost(id: number, input: PostInput): Promise<PostRow> {
  const posts = readLocalPosts();
  const current = posts.find(post => post.id === id);
  if (!current) throw new Error('Article introuvable : il a peut-être été supprimé.');
  assertUniqueSlug(posts, input.slug, id);
  const row: PostRow = { ...current, ...input, updated_at: new Date().toISOString() };
  save(posts.map(post => (post.id === id ? row : post)));
  return row;
}

export async function deletePost(id: number): Promise<void> {
  save(readLocalPosts().filter(post => post.id !== id));
}

// --- Export / import ------------------------------------------------------

function download(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

/** Articles publiés + programmés : le fichier public/blog-posts.json du site. */
export const sitePayload = (posts: PostRow[]) =>
  posts
    .filter(post => post.status === 'published')
    .sort((a, b) => Date.parse(b.published_at!) - Date.parse(a.published_at!));

export function exportForSite() {
  download('blog-posts.json', sitePayload(readLocalPosts()));
}

export function exportBackup() {
  download(`sauvegarde-blog-${new Date().toISOString().slice(0, 10)}.json`, readLocalPosts().sort(byUpdatedDesc));
}

/** Fusionne un fichier exporté (sauvegarde ou blog-posts.json). La version la plus récente gagne. */
export async function importPosts(file: File) {
  let data: unknown;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error('Fichier illisible : ce n\'est pas un JSON valide.');
  }
  const incoming = Array.isArray(data) ? data.filter(isPostRow) : [];
  if (!incoming.length) throw new Error('Aucun article valide trouvé dans ce fichier.');

  const posts = readLocalPosts();
  let added = 0;
  let updated = 0;
  let skipped = 0;
  for (const post of incoming) {
    const index = posts.findIndex(item => item.id === post.id);
    if (index >= 0) {
      if (Date.parse(post.updated_at) > Date.parse(posts[index].updated_at)) { posts[index] = post; updated++; }
      continue;
    }
    if (posts.some(item => item.slug === post.slug)) { skipped++; continue; }
    posts.push(post);
    added++;
  }
  save(posts);
  return { added, updated, skipped, ignored: (Array.isArray(data) ? data.length : 0) - incoming.length };
}

/** Nombre de différences entre les articles publiés localement et le fichier du site. */
export function countPendingChanges(local: PostRow[], site: PostRow[]) {
  const signature = (post: PostRow) => JSON.stringify([post.slug, post.title, post.excerpt, post.content, post.tags, post.published_at]);
  const localPublished = new Map(sitePayload(local).map(post => [post.id, signature(post)]));
  const sitePublished = new Map(site.map(post => [post.id, signature(post)]));
  let pending = 0;
  localPublished.forEach((sig, id) => { if (sitePublished.get(id) !== sig) pending++; });
  sitePublished.forEach((_sig, id) => { if (!localPublished.has(id)) pending++; });
  return pending;
}

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export function timeAgo(iso: string) {
  const seconds = Math.round((Date.now() - Date.parse(iso)) / 1000);
  if (seconds < 60) return 'à l\'instant';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return days < 30 ? `il y a ${days} j` : formatDateTime(iso);
}
