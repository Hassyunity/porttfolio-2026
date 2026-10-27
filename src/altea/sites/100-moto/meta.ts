import { lazy } from 'react';
import type { AlteaSiteMeta } from '../../registry';

const meta: AlteaSiteMeta = {
  slug: '100-moto',
  subdomain: '100moto',
  name: '100% Moto',
  formula: 'vitrine',
  client: {
    company: '100% Moto (démo)',
    city: 'Ville à définir',
  },
  demo: true,
  Component: lazy(() => import('./Site')),
};

export default meta;
