import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { ExternalLink, LogOut, ShieldAlert } from 'lucide-react';
import '../assets/styles/Blog.css';
import './Admin.css';
import { PASSWORD_HASH, hasSession, signOut } from './auth';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminEditor from './AdminEditor';

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

const AdminApp = () => {
  useNoIndex();
  const [authed, setAuthed] = useState(hasSession);

  if (!PASSWORD_HASH) {
    return (
      <div className="admin-gate">
        <div className="admin-card">
          <ShieldAlert size={22} />
          <h1>Mot de passe non configuré</h1>
          <p>
            Ajoutez <code>VITE_ADMIN_PASSWORD_HASH</code> (empreinte SHA-256 de votre mot de passe) dans
            <code> .env.local</code>, puis relancez le serveur. Pour la calculer :
          </p>
          <p><code>npm run admin:hash -- "votre-mot-de-passe"</code></p>
        </div>
      </div>
    );
  }

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const logout = () => { signOut(); setAuthed(false); };

  return (
    <div className="admin">
      <header className="admin-top">
        <Link to="/admin" className="admin-brand">
          <span className="brand-mark" aria-hidden="true">ht.</span>
          <span>Studio <em>blog</em></span>
        </Link>
        <div className="admin-top-actions">
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="admin-link"><ExternalLink size={14} /> Voir le blog</a>
          <button type="button" className="admin-link" onClick={logout}><LogOut size={14} /> Déconnexion</button>
        </div>
      </header>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="articles/:id" element={<AdminEditor />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </div>
  );
};

export default AdminApp;
