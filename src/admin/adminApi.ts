import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { STATIC_POSTS } from '../data/blog';
import { invalidatePublishedPosts } from '../lib/blogApi';
import { isNative } from '../lib/platform';
import { POSTS_TABLE, POST_COLUMNS, isPostRow, type PostRow, type PostStatus } from '../lib/postStore';

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

/** Levée quand l'article a été modifié depuis un autre appareil entre-temps. */
export class ConflictError extends Error {}

function client() {
  if (!supabase) throw new Error('Supabase n\'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  return supabase;
}

/** Traduit les erreurs Postgres / PostgREST en messages compréhensibles. */
function fail(error: PostgrestError): never {
  if (error.code === '23505') throw new Error('Ce slug est déjà utilisé par un autre article. Choisissez-en un autre.');
  if (error.code === '42501' || error.code === 'PGRST301') throw new Error('Accès refusé : votre compte n\'a pas les droits d\'administration.');
  if (error.code === '23514') throw new Error('Données invalides (titre, slug, résumé ou nombre de tags hors limites).');
  if (error.code === 'PGRST116') throw new Error('Article introuvable : il a peut-être été supprimé.');
  if (error.code === '42P01') throw new Error('La table blog_posts n\'existe pas : exécutez supabase/blog_posts.sql dans Supabase.');
  throw new Error(error.message || 'Erreur réseau : vérifiez votre connexion.');
}

function assertSlugFree(slug: string) {
  if (STATIC_POSTS.some(post => post.slug === slug)) {
    throw new Error('Ce slug est déjà utilisé par un article existant du blog. Choisissez-en un autre.');
  }
}

export async function listPosts(): Promise<PostRow[]> {
  const { data, error } = await client().from(POSTS_TABLE).select(POST_COLUMNS).order('updated_at', { ascending: false });
  if (error) fail(error);
  return data as PostRow[];
}

export async function getPost(id: number): Promise<PostRow> {
  const { data, error } = await client().from(POSTS_TABLE).select(POST_COLUMNS).eq('id', id).single();
  if (error) fail(error);
  return data as PostRow;
}

export async function createPost(input: PostInput): Promise<PostRow> {
  assertSlugFree(input.slug);
  const { data, error } = await client().from(POSTS_TABLE).insert(input).select(POST_COLUMNS).single();
  if (error) fail(error);
  invalidatePublishedPosts();
  return data as PostRow;
}

/**
 * Met à jour l'article seulement s'il n'a pas changé depuis `expectedUpdatedAt`
 * (verrouillage optimiste) : deux appareils ne s'écrasent jamais en silence.
 */
export async function updatePost(id: number, input: PostInput, expectedUpdatedAt: string): Promise<PostRow> {
  assertSlugFree(input.slug);
  const { data, error } = await client()
    .from(POSTS_TABLE)
    .update(input)
    .eq('id', id)
    .eq('updated_at', expectedUpdatedAt)
    .select(POST_COLUMNS);
  if (error) fail(error);
  if (!data?.length) {
    const { data: current } = await client().from(POSTS_TABLE).select('id').eq('id', id).maybeSingle();
    if (!current) throw new Error('Article introuvable : il a été supprimé depuis un autre appareil.');
    throw new ConflictError('Cet article a été modifié depuis un autre appareil. Votre texte est conservé ici : rechargez la dernière version pour comparer.');
  }
  invalidatePublishedPosts();
  return data[0] as PostRow;
}

export async function deletePost(id: number): Promise<void> {
  const { error } = await client().from(POSTS_TABLE).delete().eq('id', id);
  if (error) fail(error);
  invalidatePublishedPosts();
}

// --- Sauvegarde / import ------------------------------------------------------

export async function exportBackup() {
  const posts = await listPosts();
  const json = JSON.stringify(posts, null, 2) + '\n';
  const name = `sauvegarde-blog-${new Date().toISOString().slice(0, 10)}.json`;

  if (isNative) {
    // Pas de téléchargement dans la WebView Android : fichier temporaire + menu de partage (Drive, mail, Fichiers…).
    const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([import('@capacitor/filesystem'), import('@capacitor/share')]);
    const { uri } = await Filesystem.writeFile({ path: name, data: json, directory: Directory.Cache, encoding: Encoding.UTF8 });
    try {
      await Share.share({ title: name, files: [uri], dialogTitle: 'Enregistrer la sauvegarde' });
    } catch (err) {
      if (!/cancel/i.test((err as Error).message)) throw err;
    }
    return;
  }

  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Envoie des articles (fichier de sauvegarde ou ancien stockage du navigateur) dans Supabase.
 * Rapprochement par slug : un article existant n'est remplacé que si la version importée est plus récente.
 */
export async function importRows(rows: PostRow[]) {
  const existing = new Map((await listPosts()).map(post => [post.slug, post]));
  let added = 0;
  let updated = 0;
  let skipped = 0;
  for (const row of rows) {
    const input: PostInput = {
      slug: row.slug, title: row.title, excerpt: row.excerpt, content: row.content,
      tags: row.tags, status: row.status, published_at: row.published_at,
    };
    const current = existing.get(row.slug);
    if (current) {
      if (Date.parse(row.updated_at) > Date.parse(current.updated_at)) {
        await updatePost(current.id, input, current.updated_at);
        updated++;
      } else {
        skipped++;
      }
    } else if (STATIC_POSTS.some(post => post.slug === row.slug)) {
      skipped++;
    } else {
      await createPost(input);
      added++;
    }
  }
  return { added, updated, skipped };
}

export async function importFile(file: File) {
  let data: unknown;
  try {
    data = JSON.parse(await file.text());
  } catch {
    throw new Error('Fichier illisible : ce n\'est pas un JSON valide.');
  }
  const rows = Array.isArray(data) ? data.filter(isPostRow) : [];
  if (!rows.length) throw new Error('Aucun article valide trouvé dans ce fichier.');
  return importRows(rows);
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
