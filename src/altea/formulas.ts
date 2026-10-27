// Les trois formules proposées par l'agence Altea. Les prix sont propres à chaque client
// (saisis dans l'admin, table altea_sites) : ici, seulement le contenu de chaque offre.

export type FormulaId = 'vitrine' | 'avance' | 'super-pro';

export interface Formula {
  id: FormulaId;
  name: string;
  pitch: string;
  features: string[];
}

export const FORMULAS: Record<FormulaId, Formula> = {
  vitrine: {
    id: 'vitrine',
    name: 'Vitrine',
    pitch: 'Être trouvé et contacté facilement.',
    features: [
      'Site une page responsive (mobile, tablette, ordinateur)',
      'Présentation, marques, services, horaires, plan d\'accès',
      'Boutons appel, itinéraire et e-mail',
      'Hébergement, sous-domaine Altea et mises à jour incluses',
    ],
  },
  avance: {
    id: 'avance',
    name: 'Avancé',
    pitch: 'Montrer le stock et générer des demandes.',
    features: [
      'Tout de la formule Vitrine',
      'Catalogue motos neuves et occasions',
      'Formulaires essai, reprise et rendez-vous atelier',
      'Référencement local (Google) et statistiques de visite',
    ],
  },
  'super-pro': {
    id: 'super-pro',
    name: 'Super Pro',
    pitch: 'Un outil commercial complet.',
    features: [
      'Tout de la formule Avancé',
      'Stock synchronisé et fiches détaillées',
      'Demandes de financement et prise de rendez-vous en ligne',
      'Nom de domaine personnalisé et suivi prioritaire',
    ],
  },
};

export const FORMULA_LIST = Object.values(FORMULAS);
