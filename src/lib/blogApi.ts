import { useEffect, useState } from 'react';
import { STATIC_POSTS, formatDate, type BlogPost } from '../data/blog';
import { fetchSitePosts, isLive, readLocalPosts, type PostRow } from './postStore';

const fromRow = (row: PostRow): BlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  tags: row.tags,
  date: formatDate(row.published_at!),
  sortTime: Date.parse(row.published_at!),
});

let cache: Promise<BlogPost[]> | null = null;

/**
 * Articles visibles sur le blog :
 * historiques (JSON) + fichier public/blog-posts.json (visibles par tous)
 * + articles publiés depuis l'admin dans ce navigateur (aperçu avant export).
 * Les articles programmés n'apparaissent qu'une fois leur date atteinte.
 */
export function loadPublishedPosts(): Promise<BlogPost[]> {
  cache ??= (async () => {
    const bySlug = new Map<string, BlogPost>();
    STATIC_POSTS.forEach(post => bySlug.set(post.slug, post));
    (await fetchSitePosts()).filter(isLive).forEach(row => bySlug.set(row.slug, fromRow(row)));
    readLocalPosts().filter(isLive).forEach(row => bySlug.set(row.slug, fromRow(row)));
    return [...bySlug.values()].sort((a, b) => b.sortTime - a.sortTime);
  })();
  return cache;
}

/** À appeler après une modification depuis l'admin. */
export function invalidatePublishedPosts() {
  cache = null;
}

export function usePublishedPosts() {
  const [state, setState] = useState({ posts: STATIC_POSTS, loading: true });
  useEffect(() => {
    let alive = true;
    loadPublishedPosts().then(posts => { if (alive) setState({ posts, loading: false }); });
    return () => { alive = false; };
  }, []);
  return state;
}
