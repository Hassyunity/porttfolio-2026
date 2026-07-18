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
    label: 'Ses expertises',
    keywords: [
      'expertise', 'competence', 'compétence', 'stack', 'technologie',
      'techno', 'skill', 'maitrise', 'maîtrise'
    ],
    answer:
      "Le stack de Hassy, en résumé :\n→ Frontend : TypeScript, React\n→ Backend : Ruby on Rails, Node.js, PostgreSQL\n→ DevOps : Git, Docker, Nginx, CI/CD, Cloud\n→ SaaS & CRM sur mesure : n8n, Make (Integromat), API Stripe, Signature électronique, CRM personnalisé\n→ Outils du quotidien : VS Code, Postman, Figma, GitHub, Jira, ClickUp, Trello\n\nBref, de la conception à la mise en prod, il touche à (presque) tout — logique, vu qu'il est aussi CTO chez XR Technologie.",
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
