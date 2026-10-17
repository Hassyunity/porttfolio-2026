import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError(authError.status === 400 ? 'Email ou mot de passe incorrect.' : authError.message);
      setPassword('');
      setLoading(false);
    }
    // En cas de succès, onAuthStateChange (AdminApp) prend le relais.
  };

  return (
    <div className="admin-gate">
      <form className="admin-card admin-login" onSubmit={submit}>
        <span className="admin-login-icon"><Lock size={18} /></span>
        <h1>Espace d'administration</h1>
        <p>Connectez-vous pour retrouver vos articles sur tous vos appareils.</p>

        <label className="admin-field">
          <span>Email</span>
          <input type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </label>
        <label className="admin-field">
          <span>Mot de passe</span>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required />
        </label>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Connexion…' : <>Se connecter <ArrowRight size={16} /></>}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
