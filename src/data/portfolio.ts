import type { LucideIcon } from 'lucide-react';
import { LayoutTemplate, Server, CloudCog, Workflow, Mail, Linkedin, Github, Phone } from 'lucide-react';
import alteaImg from '../assets/images/altea.jpg';
import autoImg from '../assets/images/auto.jpg';
import bazarImg from '../assets/images/leader.jpg';
import hmaxImg from '../assets/images/h-max.png';
import frontendArt from '../assets/images/skills/frontend.svg';
import backendArt from '../assets/images/skills/backend.svg';
import devopsArt from '../assets/images/skills/devops.svg';
import automationArt from '../assets/images/skills/automation.svg';
import xrLogo from '../assets/images/logos/xr-technologie.webp';
import ingedataLogo from '../assets/images/logos/ingedata.png';

// Ordre des écrans : sert au menu, à la barre « précédent / suivant » et aux raccourcis clavier.
export const PAGES = [
  { path: '/', label: 'Accueil' },
  { path: '/projets', label: 'Projets' },
  { path: '/profil', label: 'Profil' },
  { path: '/expertises', label: 'Expertises' },
  { path: '/parcours', label: 'Parcours' },
  { path: '/blog', label: 'Blog' },
  { path: '/album', label: 'Album' },
  { path: '/contact', label: 'Contact' },
];

export const EMAIL = 'hassy.tsihoarana@gmail.com';
export const WHATSAPP_NUMBER = '261385841524';

export interface Project {
  title: string;
  category: string;
  year?: string;
  description: string;
  impact?: string;
  tags: string[];
  link?: string;
  image?: string;
  wordmark?: string;
}

export const PROJECTS: Project[] = [
  {
    title: 'Altea Flow',
    category: 'SaaS · Agents IA',
    year: '2026',
    description: "SaaS d'automatisation de workflows métier et de réconciliation de données piloté par des agents IA. Conçu de bout en bout, du backend Rails à l'infrastructure Supabase.",
    impact: 'SaaS en production',
    tags: ['n8n', 'Ruby on Rails', 'React', 'PostgreSQL', 'Supabase'],
    link: 'https://altea-flow.netlify.app/',
    image: alteaImg,
  },
  {
    title: 'Auto | DECISIONS',
    category: "Agence d'automatisation",
    description: "Agence d'automatisation intelligente spécialisée sur n8n. Des solutions sur mesure pour les équipes RH, Finance et Marketing qui transforment des processus critiques en workflows fluides.",
    impact: 'Workflows déployés multi-clients',
    tags: ['n8n', 'Workflow Automation', 'API Integration', 'AI Agents'],
    link: 'https://auto-decisions.netlify.app',
    image: autoImg,
  },
  {
    title: 'Bazar Naka',
    category: 'E-commerce',
    description: 'Supermarché en ligne complet : exploration du catalogue, promotions et gestion dynamique du panier.',
    tags: ['Ruby on Rails', 'PostgreSQL', 'HTML/CSS'],
    link: 'https://bazarnaka.onrender.com/',
    image: bazarImg,
  },
  {
    title: 'H-max AI',
    category: 'Assistant virtuel',
    description: 'Assistant virtuel interactif intégrant une logique algorithmique personnalisée et une API météo en temps réel.',
    tags: ['React', 'TypeScript', 'Vite.js', 'OpenWeather API'],
    link: 'https://H-max.netlify.app/',
    image: hmaxImg,
  },
  {
    title: 'Pulse by Ingedata',
    category: "Plateforme RH d'entreprise",
    description: 'Microservices Recrutement, Talent et Candidat, couverts par des tests automatisés RSpec et Cypress pour limiter les régressions.',
    impact: 'Fiabilité renforcée par les tests',
    tags: ['Ruby on Rails', 'PostgreSQL', 'RSpec', 'Cypress', 'Docker'],
    wordmark: 'Pulse.',
  },
  {
    title: 'Babel Goods',
    category: 'E-commerce social',
    description: 'Gestion centralisée des commandes, clients et statistiques de ventes pour boutiques Facebook.',
    tags: ['React', 'Vite.js', 'Tailwind CSS'],
    link: 'https://babel-goods-fr.onrender.com/',
    wordmark: 'babel goods',
  },
  {
    title: 'API RESTful Node/React',
    category: 'Full-stack',
    description: "Création d'endpoints personnalisés et consommation d'APIs REST modernes.",
    tags: ['Node.js', 'Express', 'React', 'Vite.js'],
    link: 'https://react-node-811w.onrender.com/',
    wordmark: '{ API }',
  },
];

export const PILLARS = [
  { title: 'Concevoir', text: 'Des architectures SaaS claires et évolutives, pensées pour le produit autant que pour le code.' },
  { title: 'Automatiser', text: 'Des workflows n8n et des agents IA qui suppriment les tâches répétitives et fiabilisent les données.' },
  { title: 'Piloter', text: "Déploiements cloud, CI/CD et coordination d'équipe : la technique au service des objectifs business." },
];

export interface Capability {
  Icon: LucideIcon;
  name: string;
  description: string;
  list: string[];
  image: string;
}

export const CAPABILITIES: Capability[] = [
  { Icon: LayoutTemplate, name: 'Frontend', description: 'Interfaces rapides, accessibles et soignées.', list: ['React', 'TypeScript', 'Vite', 'CSS moderne'], image: frontendArt },
  { Icon: Server, name: 'Backend & API', description: 'Architectures robustes et APIs bien conçues.', list: ['Ruby on Rails', 'Node.js', 'PostgreSQL', 'REST / JWT'], image: backendArt },
  { Icon: CloudCog, name: 'DevOps & Cloud', description: 'Des mises en production sereines et répétables.', list: ['Docker', 'Nginx', 'CI/CD', 'Git', 'Cloud'], image: devopsArt },
  { Icon: Workflow, name: 'SaaS, CRM & automatisation', description: 'Des processus métier qui tournent tout seuls.', list: ['n8n', 'Make', 'API Stripe', 'Signature électronique', 'CRM sur mesure'], image: automationArt },
];

export const TOOLS = ['VS Code', 'Postman', 'Figma', 'GitHub', 'Jira', 'ClickUp', 'Trello'];

export interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  logo: string;
  bullets: string[];
  stack: string[];
}

export const JOBS: Job[] = [
  {
    title: 'Fullstack Developer, DevOps & CTO',
    company: 'XR Technologie',
    location: 'Madagascar',
    period: "Aujourd'hui",
    current: true,
    logo: xrLogo,
    bullets: [
      'Pilotage technique et architecture globale des produits',
      'Développement full-stack avec Ruby on Rails et React',
      'Déploiements, infrastructure et automatisation (DevOps)',
      "Gestion de projets transverses et coordination d'équipe",
    ],
    stack: ['Ruby on Rails', 'React', 'Docker', 'CI/CD', 'n8n'],
  },
  {
    title: 'Développeur Full-stack',
    company: 'Pulse by Ingedata',
    location: 'Madagascar',
    period: 'Précédemment',
    logo: ingedataLogo,
    bullets: [
      'Développement de microservices RH (Recrutement, Talent, Candidat)',
      'Mise en place de tests automatisés avec RSpec et Cypress',
    ],
    stack: ['Ruby on Rails', 'PostgreSQL', 'AppScript', 'RSpec', 'Cypress', 'Docker'],
  },
];

export const CONTACT_METHODS = [
  { label: 'Email', value: EMAIL, link: `mailto:${EMAIL}`, Icon: Mail },
  { label: 'Téléphone', value: '+261 34 16 020 73', link: 'tel:+261341602073', Icon: Phone },
  { label: 'LinkedIn', value: 'tsihoarana-hassy', link: 'https://www.linkedin.com/in/tsihoarana-hassy-b8349020b/', Icon: Linkedin },
  { label: 'GitHub', value: 'Hassyunity · 73 dépôts', link: 'https://github.com/Hassyunity', Icon: Github },
];
