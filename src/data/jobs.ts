
import xrLogo from '../assets/images/logos/xr-technologie.webp';
import ingedataLogo from '../assets/images/logos/ingedata.png';
import urbanViewLogo from '../assets/images/logos/urban-view.webp';
import kafeCodeLogo from '../assets/images/logos/kafecode-360.png';

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
    title: 'Co-fondateur | Direction & Innovation technologique',
    company: 'Kafe Code 360',
    location: 'Madagascar',
    period: 'Depuis Novembre 2026',
    current: true,
    logo: kafeCodeLogo,
    bullets: [
      'Co-fondation et développement stratégique de Kafe Code 360',
      'Définition de la vision technologique et pilotage de l’innovation',
      'Conception et développement de solutions numériques sur mesure pour les entreprises',
      'Développement de sites web, applications métier et plateformes digitales',
      'Intégration de l’intelligence artificielle et automatisation des processus métier',
      'Gestion des infrastructures, solutions d’hébergement et environnements DevOps',
      'Accompagnement des clients dans leur transformation numérique',
    ],
    stack: [
      'Fullstack Development',
      'Ruby on Rails',
      'React',
      'DevOps',
      'Artificial Intelligence',
      'Automation',
      'Digital Transformation',
    ],
  },

  {
    title: 'Fullstack Developer, DevOps & CTO',
    company: 'XR Technologie',
    location: 'Madagascar',
    period: 'Mai 2026 – Octobre 2026',
    current: false,
    logo: xrLogo,
    branches: [
      {
        name: 'Urban View 360 XR',
        logo: urbanViewLogo,
        note: "Branche d'XR Technologie",
      },
    ],
    bullets: [
      'Pilotage technique et architecture globale des produits',
      'Développement full-stack avec Ruby on Rails et React',
      'Déploiements, infrastructure et automatisation (DevOps)',
      'Coordination des équipes de développement et du studio',
      'Gestion des fournisseurs, ressources et outils technologiques',
      'Gestion et sécurisation des données de l’entreprise',
      'Pilotage technique des projets XR Brain et XR Flow',
    ],
    stack: [
      'Ruby on Rails',
      'React',
      'Docker',
      'CI/CD',
      'n8n',
      'DevOps',
      'Technical Leadership',
    ],
  },

  {
    title: 'Développeur Full-stack',
    company: 'Pulse by Ingedata',
    location: 'Madagascar',
    period: 'Précédemment',
    logo: ingedataLogo,
    bullets: [
      'Développement de microservices RH (Recrutement, Talent, Candidat)',
      'Développement backend et collaboration avec les équipes frontend',
      'Mise en place de tests automatisés avec RSpec et Cypress',
      'Réalisation de tests techniques et fonctionnels',
      'Participation aux processus Agile et à l’amélioration continue',
    ],
    stack: [
      'Ruby on Rails',
      'PostgreSQL',
      'AppScript',
      'RSpec',
      'Cypress',
      'Docker',
    ],
  },
];
