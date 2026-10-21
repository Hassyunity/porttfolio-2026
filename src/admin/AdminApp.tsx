import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { Bot, ExternalLink, FileText, LogOut, ShieldAlert } from 'lucide-react';
import '../assets/styles/Blog.css';
import './Admin.css';
import { supabase } from '../lib/supabaseClient';
import { siteUrl } from '../lib/platform';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminEditor from './AdminEditor';
import AgentDashboard from './AgentDashboard';
import AgentScript from './AgentScript';

/** Empêche l'indexation de l'admin par les moteurs de recherche. */
function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    const previousTitle = document.title;
    document.title = 'Administration — Blog';
    return () => { meta.remove(); document.title = previousTitle; };
  }, []);
}

const blogUrl = siteUrl('/blog');

const AdminApp = () => {
  useNoIndex();
  const inAgent = useLocation().pathname.startsWith('/admin/agent');
  // undefined = session en cours de lecture
  const [session, setSession] = useState<Session | null | undefined>(supabase ? undefined : null);
  const [adminCheck, setAdminCheck] = useState<{ userId: string; ok: boolean; error?: string } | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  // Le droit d'admin est vérifié côté base (table blog_admins), pas seulement la connexion.
  const userId = session?.user.id;
  useEffect(() => {
    if (!supabase || !userId) return;
    supabase.rpc('is_blog_admin').then(({ data, error }) => {
      setAdminCheck({ userId, ok: !error && data === true, error: error?.message });
    });
  }, [userId]);

  const check = userId && adminCheck?.userId === userId ? adminCheck : null;
  const signOut = () => supabase?.auth.signOut();

  if (!supabase) {
    return (
      <div className="admin-gate">
        <div className="admin-card">
          <ShieldAlert size={22} />
          <h1>Supabase n'est pas configuré</h1>
          <p>
            Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>.env.local</code>
            (Supabase › Project Settings › API), puis relancez le serveur.
          </p>
        </div>
      </div>
    );
  }

  if (session === undefined || (session && !check)) {
    return <div className="admin-gate"><p className="admin-muted">Vérification de l'accès…</p></div>;
  }

  if (!session) return <AdminLogin />;

  if (!check?.ok) {
    return (
      <div className="admin-gate">
        <div className="admin-card">
          <ShieldAlert size={22} />
          <h1>Accès refusé</h1>
          {check?.error
            ? <p>La vérification a échoué ({check.error}). Avez-vous exécuté <code>supabase/blog_posts.sql</code> ?</p>
            : <p>Le compte <strong>{session.user.email}</strong> n'est pas administrateur du blog.</p>}
          <button type="button" className="btn btn-ghost" onClick={signOut}>Se déconnecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <header className="admin-top">
        <Link to="/admin" className="admin-brand">
          <span className="brand-mark" aria-hidden="true">ht.</span>
          <span>Studio <em>blog</em></span>
        </Link>
        <nav className="admin-nav" aria-label="Sections">
          <Link to="/admin" className={inAgent ? '' : 'is-active'} aria-current={inAgent ? undefined : 'page'}><FileText size={14} /> Articles</Link>
          <Link to="/admin/agent" className={inAgent ? 'is-active' : ''} aria-current={inAgent ? 'page' : undefined}><Bot size={14} /> Agent IA</Link>
        </nav>
        <div className="admin-top-actions">
          <span className="admin-user">{session.user.email}</span>
          {blogUrl && <a href={blogUrl} target="_blank" rel="noopener noreferrer" className="admin-link"><ExternalLink size={14} /> Voir le blog</a>}
          <button type="button" className="admin-link" onClick={signOut}><LogOut size={14} /> Déconnexion</button>
        </div>
      </header>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="articles/:id" element={<AdminEditor />} />
        <Route path="agent" element={<AgentDashboard />} />
        <Route path="agent/:id" element={<AgentScript />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminApp;
