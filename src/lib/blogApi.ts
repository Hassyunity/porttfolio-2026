import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { STATIC_POSTS, formatDate, type BlogPost } from '../data/blog';
import { POSTS_TABLE, type PostRow } from './postStore';

type PublicRow = Pick<PostRow, 'id' | 'slug' | 'title' | 'excerpt' | 'content' | 'tags' | 'published_at'>;

const fromRow = (row: PublicRow): BlogPost => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  content: row.content,
  tags: row.tags ?? [],
  date: formatDate(row.published_at!),
  sortTime: Date.parse(row.published_at!),
});

let cache: Promise<BlogPost[]> | null = null;

/**
 * Articles visibles sur le blog : historiques (JSON) + publiés depuis /admin.
 * Les articles programmés n'apparaissent qu'une fois leur date atteinte.
 */
export function loadPublishedPosts(): Promise<BlogPost[]> {
  cache ??= (async () => {
    let remote: BlogPost[] = [];
    if (supabase) {
      // La RLS masque déjà brouillons et articles programmés ; le filtre explicite
      // garde le même résultat quand l'admin est connecté dans ce navigateur.
      const { data, error } = await supabase
        .from(POSTS_TABLE)
        .select('id, slug, title, excerpt, content, tags, published_at')
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });
      if (error) {
        console.error('Erreur chargement articles :', error.message);
        cache = null; // on retentera au prochain affichage
      } else {
        remote = (data ?? []).map(fromRow);
      }
    }
    const slugs = new Set(remote.map(post => post.slug));
    return [...remote, ...STATIC_POSTS.filter(post => !slugs.has(post.slug))]
      .sort((a, b) => b.sortTime - a.sortTime);
  })();
  return cache;
}

/** À appeler après une modification depuis l'admin. */
export function invalidatePublishedPosts() {
  cache = null;
}

export function usePublishedPosts() {
  const [state, setState] = useState({ posts: STATIC_POSTS, loading: Boolean(supabase) });
  useEffect(() => {
    let alive = true;
    loadPublishedPosts().then(posts => { if (alive) setState({ posts, loading: false }); });
    return () => { alive = false; };
  }, []);
  return state;
}
