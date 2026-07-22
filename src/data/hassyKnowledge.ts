export interface KnowledgeTopic {
  id: string;
  label: string;
  keywords: string[];
  answer: string;
}

export const knowledgeBase: KnowledgeTopic[] = [
  {
    id: 'experience_pro',
    label: 'Ses expériences pro',
    keywords: [
      'experience pro', 'expérience pro', 'expérience professionnelle',
      'boulot', 'job', 'poste', 'entreprise', 'pulse', 'ingedata', 'travail', 'travaille',
      'xr technologie', 'xr', 'cto', 'devops', 'responsable projet', 'chef de projet'
    ],
    answer:
      "Aujourd'hui, Hassy porte plusieurs casquettes chez XR Technologie : Fullstack Developer, DevOps, Responsable Projet... et CTO. Concrètement, ça veut dire qu'il ne se contente pas d'écrire du code : il pense l'architecture, sécurise les déploiements, et prend les décisions techniques qui engagent toute l'équipe.\n\nAvant ça (et un peu en parallèle), il a mis les mains dans le cambouis chez Pulse by Ingedata, une plateforme RH où il a bâti des microservices critiques (Recrutement, Talent, Candidat) et blindé le tout avec RSpec et Cypress.\n\nEt à côté de ça, il trouve encore le temps de lancer ses propres projets SaaS : Altea Flow, Auto|DECISIONS, Babel Goods, Bazar Naka, H-max AI... Un profil qui code, qui pilote, et qui n'a clairement pas peur de porter plusieurs chapeaux à la fois.",
  },
  {
    id: 'annees_experience',
    label: "Son année d'expérience",
    keywords: [
      'annee', 'année', 'annees', 'années', 'ancienneté', 'depuis quand',
      'combien de temps', 'combien d\'annee', 'experience de'
    ],
    answer:
      "Ça fait 3 à 5 ans que Hassy code en full-stack — largement de quoi apprendre en marchant, rater quelques déploiements du vendredi (on ne recommence plus 😅), et se spécialiser sérieusement sur Ruby on Rails et React.\n\nAujourd'hui, cette expérience, il la met au service de XR Technologie en tant que CTO — la preuve que le temps passé à coder finit par se transformer en vision technique.",
  },
  {
    id: 'expertises',
    label: 'Sa stack technique',
    keywords: [
      'expertise', 'competence', 'compétence', 'stack', 'technologie',
      'techno', 'skill', 'maitrise', 'maîtrise'
    ],
    answer:
      "Le stack de Hassy, en résumé :\n→ Frontend : TypeScript, React\n→ Backend : Ruby on Rails, Node.js, PostgreSQL\n→ DevOps : Git, Docker, Nginx, CI/CD, Cloud\n→ SaaS & CRM sur mesure : n8n, Make (Integromat), API Stripe, Signature électronique, CRM personnalisé\n→ Outils du quotidien : VS Code, Postman, Figma, GitHub, Jira, ClickUp, Trello\n\nBref, de la conception à la mise en prod, il touche à (presque) tout — logique, vu qu'il est aussi CTO chez XR Technologie.",
  },
  {
    id: 'automatisation',
    label: 'Son expertise automatisation',
    keywords: [
      'automatisation', 'automatiser', 'n8n', 'make (integromat)', 'workflow',
      'agents ia', 'agent ia', 'intelligence artificielle'
    ],
    answer:
      "L'automatisation, c'est un vrai fil rouge chez Hassy : n8n, Make (Integromat), API Stripe, signature électronique, CRM sur mesure...\n\nC'est le cœur d'Altea Flow (réconciliation de données pilotée par agents IA) et d'Auto | DECISIONS (workflows n8n pour des clients en RH, Finance et Marketing). Il explore aussi les fonctionnalités IA pour optimiser les processus métiers au quotidien.",
  },
  {
    id: 'projets',
    label: 'Ses projets',
    keywords: [
      'projet', 'projets', 'portfolio de projets', 'altea', 'auto decisions',
      'auto|decisions', 'babel', 'bazar naka', 'h-max', 'hmax', 'api restful', 'realisation'
    ],
    answer:
      "Quelques réalisations de Hassy :\n→ Altea Flow (2026) — SaaS d'automatisation piloté par agents IA (n8n, Rails, React, Supabase)\n→ Auto | DECISIONS — agence d'automatisation n8n pour RH, Finance, Marketing\n→ Bazar Naka — supermarché en ligne (Rails, PostgreSQL)\n→ Babel Goods — e-commerce pour boutiques Facebook (React, Vite, Tailwind)\n→ H-max AI — assistant virtuel avec météo en temps réel (React, TypeScript)\n→ API RESTful Node/React — projet full-stack sur les APIs REST\n→ Pulse by Ingedata — plateforme RH d'entreprise (projet confidentiel)\n\nTous les liens sont dans la section ~/projets juste au-dessus !",
  },
  {
    id: 'resultats',
    label: 'Ses résultats',
    keywords: ['résultat', 'résultats', 'impact', 'accomplissement'],
    answer:
      "Quelques résultats concrets plutôt que des promesses en l'air :\n→ Altea Flow : SaaS complet en production, de la conception à l'infra\n→ Auto | DECISIONS : automatisations n8n déployées chez plusieurs clients (RH, Finance, Marketing)\n→ Pulse by Ingedata : microservices RH couverts par des tests automatisés (RSpec, Cypress) pour limiter les régressions\n\nLe détail est dans la section ~/résultats.",
  },
  {
    id: 'contact',
    label: 'Le contacter',
    keywords: ['contact', 'email', 'mail', 'linkedin', 'github', 'joindre', 'contacter'],
    answer:
      "Le plus simple : hassy.tsihoarana@gmail.com ✉️\n\nSinon :\n→ GitHub : github.com/Hassyunity (73 repos)\n→ LinkedIn : linkedin.com/in/tsihoarana-hassy-b8349020b/\n→ Ou directement via la bulle WhatsApp bleue en bas de l'écran 👋",
  },
  {
    id: 'localisation',
    label: 'Où il est basé',
    keywords: ['localisation', 'où est', 'ou est', 'basé', 'madagascar', 'pays'],
    answer:
      "Hassy est basé à Madagascar 🇲🇬 — c'est de là qu'il code, déploie et pilote ses projets, dont XR Technologie.",
  },
  {
    id: 'blog',
    label: 'Ses articles de blog',
    keywords: ['blog', 'article', 'vision ia', 'sécurité api', 'jwt', 'sécuriser une api'],
    answer:
      "Deux articles à lire dans la section ~/blogs :\n→ « L'IA : Assistante de création, pas notre futur » — comment Hassy a transformé l'IA en copilote plutôt qu'en remplaçant\n→ « Sécuriser une API : L'implémentation du JWT » — guide pratique sur l'authentification par tokens\n\nDes réflexions sur le code, l'IA et l'artisanat numérique, écrites par Hassy lui-même.",
  },
];

export const FALLBACK_ANSWER =
  "Hmm, celle-là, je ne l'ai pas encore en stock 😅 Essayez l'un des boutons ci-dessous, ou contactez Hassy directement (WhatsApp / email) — lui saura répondre !";

export function findTopic(input: string): KnowledgeTopic | null {
  const normalized = input.toLowerCase();
  return (
    knowledgeBase.find((topic) => topic.keywords.some((kw) => normalized.includes(kw))) ?? null
  );
}
