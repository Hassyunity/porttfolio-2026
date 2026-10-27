import type { ComponentType, LazyExoticComponent } from 'react';
import type { FormulaId } from './formulas';
import moto100 from './sites/100-moto/meta';

// Registre des sites clients Altea. Pour ajouter un client :
//   1. créer src/altea/sites/<slug>/ (meta.ts, Site.tsx, son contenu et son style) ;
//   2. l'ajouter à SITES ci-dessous ;
//   3. déployer une fois, puis le publier depuis /admin › Altea.

export interface AlteaSiteMeta {
  /** Identifiant (= nom du dossier et de la ligne dans altea_sites). */
  slug: string;
  /** Sous-domaine public : <subdomain>.<VITE_ALTEA_DOMAIN>. */
  subdomain: string;
  /** Nom affiché du site. */
  name: string;
  formula: FormulaId;
  client: {
    company: string;
    contact?: string;
    email?: string;
    phone?: string;
    city?: string;
  };
  /** Site de démonstration (contenu fictif) : pas un vrai client. */
  demo?: boolean;
  /** Code du site (React.lazy) : chargé seulement quand on l'affiche. */
  Component: LazyExoticComponent<ComponentType>;
}

export const SITES: AlteaSiteMeta[] = [moto100];

export const findSiteBySlug = (slug: string) => SITES.find(site => site.slug === slug);

/** Domaine des sites clients (vide tant qu'aucun domaine n'est branché). */
export const ALTEA_DOMAIN: string = (import.meta.env.VITE_ALTEA_DOMAIN ?? '').replace(/^\.+|\.+$/g, '').toLowerCase();

/** Site client correspondant à l'adresse visitée (ex. 100moto.altea.fr), sinon undefined. */
export function findSiteByHost(hostname: string) {
  if (!ALTEA_DOMAIN || !hostname.toLowerCase().endsWith(`.${ALTEA_DOMAIN}`)) return undefined;
  const sub = hostname.toLowerCase().slice(0, -(ALTEA_DOMAIN.length + 1));
  return SITES.find(site => site.subdomain === sub);
}
