import { Suspense, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { AlteaSiteMeta } from './registry';
import './PublicSite.css';

type View = 'loading' | 'online' | 'preview' | 'suspended' | 'unavailable';

/** Statut public du site (en ligne ou non) ; l'abonnement n'est jamais lisible ici. */
async function resolveView(slug: string, wantsPreview: boolean): Promise<View> {
  if (!supabase) return 'unavailable';
  const { data: status } = await supabase.rpc('altea_site_status', { p_slug: slug });
  if (status === 'published') return 'online';

  // Aperçu d'un site non publié : réservé aux administrateurs connectés.
  if (wantsPreview) {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { data: isAdmin } = await supabase.rpc('is_blog_admin');
      if (isAdmin === true) return 'preview';
    }
  }
  return status === 'suspended' ? 'suspended' : 'unavailable';
}

const PublicSite = ({ site }: { site: AlteaSiteMeta }) => {
  const wantsPreview = new URLSearchParams(window.location.search).has('apercu');
  const [view, setView] = useState<View>('loading');

  useEffect(() => {
    let alive = true;
    resolveView(site.slug, wantsPreview)
      .then(next => { if (alive) setView(next); })
      .catch(() => { if (alive) setView('unavailable'); });
    return () => { alive = false; };
  }, [site.slug, wantsPreview]);

  useEffect(() => {
    if (view === 'online' || view === 'preview') return;
    document.title = site.name;
  }, [view, site.name]);

  if (view === 'loading') return <div className="altea-status" aria-busy="true" />;

  if (view === 'suspended' || view === 'unavailable') {
    return (
      <main className="altea-status">
        <div>
          <h1>{site.name}</h1>
          <p>{view === 'suspended' ? 'Ce site est momentanément indisponible.' : 'Ce site sera bientôt en ligne.'}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      {view === 'preview' && <div className="altea-preview-banner">Aperçu : ce site n'est pas publié, seuls les administrateurs le voient.</div>}
      <Suspense fallback={<div className="altea-status" aria-busy="true" />}>
        <site.Component />
      </Suspense>
    </>
  );
};

export default PublicSite;
