import visionIA from '../pages/articles/vision_ia.json';
import securiteAPI from '../pages/articles/securite_api.json';
import reactRailsLivraison from '../pages/articles/react_rails_livraison.json';

/** Article tel qu'affiché sur le site (historique JSON ou publié depuis /admin). */
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  date: string;
  sortTime: number;
  excerpt: string;
  /** Contenu en Markdown */
  content: string;
  tags: string[];
}

interface LegacyBlock {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  items?: string[];
}

interface LegacyPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string | LegacyBlock[];
  tags: string[];
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** « 12 Mars 2026 » → timestamp */
function parseFrenchDate(value: string) {
  const [day, month, year] = value.toLowerCase().split(/\s+/);
  const index = MONTHS.indexOf(month);
  return index < 0 ? 0 : new Date(Number(year), index, Number(day)).getTime();
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const toMarkdown = (content: LegacyPost['content']) =>
  typeof content === 'string'
    ? content
    : content.map(block => {
      if (block.type === 'heading') return `## ${block.text}`;
      if (block.type === 'list') return (block.items ?? []).map(item => `- ${item}`).join('\n');
      return block.text ?? '';
    }).join('\n\n');

const fromLegacy = (post: LegacyPost): BlogPost => ({
  id: post.id,
  slug: slugify(post.title),
  title: post.title,
  date: post.date,
  sortTime: parseFrenchDate(post.date),
  excerpt: post.excerpt,
  content: toMarkdown(post.content),
  tags: post.tags,
});

/** Articles historiques, livrés avec le site. */
export const STATIC_POSTS: BlogPost[] = [reactRailsLivraison, visionIA, securiteAPI]
  .map(post => fromLegacy(post as LegacyPost))
  .sort((a, b) => b.sortTime - a.sortTime);
