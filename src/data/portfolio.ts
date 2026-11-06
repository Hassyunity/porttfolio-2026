import type { LucideIcon } from 'lucide-react';
import { LayoutTemplate, Server, CloudCog, Workflow, Mail, Linkedin, Github, Phone } from 'lucide-react';
import alteaImg from '../assets/images/altea.jpg';
import autoImg from '../assets/images/auto.jpg';
import bazarImg from '../assets/images/leader.jpg';
import babelImg from '../assets/images/babel.png';
import hmaxImg from '../assets/images/h-max.png';
import vitrinImg from '../assets/images/vitrin.png';
import dynamiqueImg from '../assets/images/dynamique.jpg';
import frontendArt from '../assets/images/skills/frontend.svg';
import backendArt from '../assets/images/skills/backend.svg';
import devopsArt from '../assets/images/skills/devops.svg';
import automationArt from '../assets/images/skills/automation.svg';
import xrLogo from '../assets/images/logos/xr-technologie.webp';
import ingedataLogo from '../assets/images/logos/ingedata.png';
import urbanViewLogo from '../assets/images/logos/urban-view.webp';

// Ordre des écrans : sert au menu, à la barre « précédent / suivant » et aux raccourcis clavier.
export const PAGES = [
  { path: '/', label: 'Accueil' },
  { path: '/projets', label: 'Projets' },
  { path: '/profil', label: 'Profil' },
  { path: '/services', label: 'Mes services' },
  { path: '/parcours', label: 'Parcours' },
  { path: '/avis', label: 'Avis' },
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
    image: babelImg,
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

/* ---------- Mes services · tarifs en ariary MGA ---------- */

export interface ServicePlan {
  name: string;
  /** Prix en ariary MGA (nombre brut, formaté à l'affichage) */
  price: number;
  description: string;
  items: string[];
  /** Formule mise en avant par défaut */
  popular?: boolean;
  /** Formule d'abonnement mensuel (affichée dans l'onglet « Abonnement », prix par mois) */
  subscription?: boolean;
  /** Étiquette affichée en haut de la carte (ex. « Starter », « Populaire », « Pro ») */
  badge?: string;
  /** Affiche « À partir de » devant le prix */
  priceFrom?: boolean;
  /** Précision affichée sous la liste (ex. limite de la formule) */
  note?: string;
}

/** Options facultatives proposées en supplément de chaque offre */
export interface ServiceAddon {
  name: string;
  description: string;
  /** Supplément en ariary MGA */
  price: number;
  features: string[];
}

export interface ServiceOffer extends Omit<Capability, 'Icon'> {
  tagline: string;
  detail: string;
  plans: ServicePlan[];
  addons: ServiceAddon[];
}

export const SERVICES: ServiceOffer[] = [
  {
    name: 'Site vitrine',
    tagline: 'Votre image en ligne, prête en quelques semaines',
    description: 'Une présence professionnelle claire, élégante et crédible pour présenter votre entreprise.',
    detail: 'Un site responsive, rapide et soigné pour présenter votre entreprise, vos activités, vos produits et vos services, avec une formule d’abonnement mensuel pour garder votre présence en ligne fiable et active.',
    list: ['Design moderne et personnalisé', 'Pages Accueil, À propos, Services et Contact', 'Formulaire de contact', 'Adaptation mobile, tablette et ordinateur', 'Optimisation SEO de base', 'Déploiement et mise en ligne'],
    image: vitrinImg,
    plans: [
      { name: 'Essentiel', price: 700000, description: 'Pour démarrer proprement votre présence web.', items: ['Jusqu’à 4 pages', 'Design moderne et responsive', 'Présentation des activités et services', 'Formulaire de contact', 'Optimisation SEO de base'] },
      { name: 'Professionnel', price: 1200000, popular: true, description: 'Le meilleur équilibre pour une image sérieuse.', items: ['Jusqu’à 8 pages', 'Design personnalisé', 'Animations et interactions modernes', 'Formulaire de contact avancé', 'SEO de base et optimisation des performances', 'Intégration Google Maps et réseaux sociaux'] },
      { name: 'Premium', price: 1800000, description: 'Pour un site premium et plus impactant.', items: ['Jusqu’à 12 pages', 'Design entièrement personnalisé', 'Animations avancées', 'Galerie et portfolio', 'SEO renforcé'] },
      {
        name: 'Hébergement Essentiel',
        subscription: true,
        badge: 'Starter',
        price: 100000,
        description: 'Pour garder votre site vitrine en ligne, sécurisé et sauvegardé.',
        items: ['1 site vitrine', '1 domaine (renouvellement facturé selon extension)', 'Certificat SSL', 'Hébergement web', 'Sauvegarde', 'Assistance standard'],
        note: 'Sans base de données incluse.',
      },
    ],
    addons: [
      {
        name: 'Gestion de fiche établissement Google',
        description: 'Mettez votre entreprise en avant dans les recherches locales Google Maps et Google Business.',
        price: 150000,
        features: ['Profil Google Business optimisé', 'Photos, horaires et informations claires', 'Mise à jour de la présence locale'],
      },
      {
        name: 'Visite virtuelle 360°',
        description: 'Faites explorer votre lieu à vos clients, où qu’ils soient, directement depuis votre site.',
        price: 290000,
        features: ['Panorama interactif intégré', 'Points d’intérêt cliquables', 'Compatible mobile et ordinateur'],
      },
    ],
  },
  {
    name: 'Site web dynamique',
    tagline: 'Une expérience interactive qui transforme les visiteurs en clients',
    description: 'Un site moderne, interactif et orienté expérience utilisateur, avec un vrai potentiel de croissance.',
    detail: 'Une plateforme web dynamique offrant une expérience fluide et intuitive : contenus gérables, données en direct, espaces utilisateurs et fonctionnalités métier adaptées à votre activité.',
    list: ['Interfaces modernes avec animations', 'Interactions dynamiques', 'Gestion des contenus', 'Connexion à des API', 'Tableaux de bord', 'Vos données stockées en data center', 'Fonctionnalités métier'],
    image: dynamiqueImg,
    plans: [
      { name: 'Starter', price: 1500000, description: 'Pour une vitrine dynamique avec plus d’interactions.', items: ['Site web dynamique', 'Sections interactives', 'Formulaire de contact', 'Responsive complet'] },
      { name: 'Business', price: 2500000, popular: true, description: 'Pour une expérience avancée, orientée conversion.', items: ['Site web dynamique complet', 'Tableaux de bord / données', 'Authentification utilisateur', 'Connexion API & CMS', 'Optimisation UX / SEO'] },
      { name: 'Scale', price: 4000000, description: 'Pour un site premium et prêt à grandir.', items: ['Architecture personnalisée', 'Plusieurs rôles et permissions', 'Tableau de bord avancé', 'Gestion de données et statistiques', 'Intégration d’API externes', 'Automatisations selon les besoins', 'Tests et déploiement'] },
      {
        name: 'Hébergement Business',
        subscription: true,
        popular: true,
        badge: 'Populaire',
        price: 150000,
        description: 'Pour un site dynamique avec sa base de données, suivi en priorité.',
        items: ['1 site dynamique', '1 base de données', 'Certificat SSL', 'Sauvegarde', 'Assistance prioritaire', 'Gestion du domaine'],
      },
      {
        name: 'Hébergement Premium',
        subscription: true,
        badge: 'Pro',
        priceFrom: true,
        price: 250000,
        description: 'Pour des applications exigeantes, avec des ressources garanties.',
        items: ['Applications dynamiques', 'Plusieurs bases de données selon ressources', 'Ressources dédiées ou garanties contractuellement', 'Sauvegardes renforcées', 'Assistance prioritaire', 'Surveillance renforcée'],
      },
    ],
    addons: [
      {
        name: 'Gestion de fiche établissement Google',
        description: 'Renforcez votre visibilité locale avec un profil Google Business propre et exploitable.',
        price: 200000,
        features: ['Profil Google Business complet', 'Présence locale optimisée', 'Informations locales mises à jour'],
      },
      {
        name: 'Visite virtuelle immersive',
        description: 'Une visite 360° du lieu intégrée à votre plateforme, avec navigation entre les espaces.',
        price: 490000,
        features: ['Navigation entre les pièces', 'Points d’intérêt et fiches liées', 'Intégrée à votre tableau de bord'],
      },
    ],
  },
];

export const TOOLS = ['VS Code', 'Postman', 'Figma', 'GitHub', 'Jira', 'ClickUp', 'Trello'];

export interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  logo: string;
  /** Filiales / branches rattachées au poste */
  branches?: { name: string; logo: string; note: string }[];
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
    branches: [{ name: 'Urban View 360 XR', logo: urbanViewLogo, note: "Branche d'XR Technologie" }],
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
  { label: 'Téléphone', value: '+261 38 58 415 24', link: 'tel:+261385841524', Icon: Phone },
  { label: 'LinkedIn', value: 'tsihoarana-hassy', link: 'https://www.linkedin.com/in/tsihoarana-hassy-b8349020b/', Icon: Linkedin },
  { label: 'GitHub', value: 'Hassyunity · 73 dépôts', link: 'https://github.com/Hassyunity', Icon: Github },
];

export interface Review {
  name: string;
  role: string;
  rating: number;
  text: string;
}

// À REMPLACER par de vrais témoignages clients avant la mise en ligne.
export const REVIEWS: Review[] = [
  {
    name: 'Client exemple 1',
    role: 'Dirigeant · PME',
    rating: 5,
    text: 'Un développeur à l’écoute, rigoureux et force de proposition. Notre application a été livrée dans les délais, avec une qualité irréprochable.',
  },
  {
    name: 'Client exemple 2',
    role: 'Responsable produit · Startup',
    rating: 5,
    text: 'Hassy a su transformer notre idée en un produit solide, de l’architecture jusqu’à la mise en production. Communication claire du début à la fin.',
  },
  {
    name: 'Client exemple 3',
    role: 'Fondatrice · E-commerce',
    rating: 5,
    text: 'L’automatisation mise en place nous fait gagner des heures chaque semaine. Un vrai partenaire technique, réactif et créatif.',
  },
];