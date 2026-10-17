import visionIA from '../pages/articles/vision_ia.json';
import securiteAPI from '../pages/articles/securite_api.json';
import reactRailsLivraison from '../pages/articles/react_rails_livraison.json';

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list';
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  content: string | ContentBlock[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  reactRailsLivraison as BlogPost,
  visionIA as BlogPost,
  securiteAPI as BlogPost,
];
