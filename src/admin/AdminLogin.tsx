
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

    if (!supabase) {
      setError('La connexion à Supabase est indisponible. Vérifiez la configuration.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError) {
        console.error('Supabase Auth Error:', {
          message: authError.message,
          status: authError.status,
          code: authError.code,
        });

        const message = authError.message.toLowerCase();

        if (
          message.includes('invalid login credentials') ||
          message.includes('invalid_credentials')
        ) {
          setError('Email ou mot de passe incorrect.');
          setPassword('');
        } else if (message.includes('email not confirmed')) {
          setError('Votre adresse email n’est pas encore confirmée.');
        } else if (
          message.includes('network') ||
          message.includes('fetch')
        ) {
          setError('Impossible de joindre Supabase. Vérifiez votre connexion.');
        } else {
          setError(authError.message);
        }

        return;
      }

      if (data.user) {
        console.log('Authentification réussie:', data.user.id);
      }

      // AdminApp détecte la session via onAuthStateChange.

    } catch (err) {
      console.error('Erreur inattendue:', err);
      setError('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-gate">
      <form className="admin-card admin-login" onSubmit={submit}>
        <span className="admin-login-icon">
          <Lock size={18} />
        </span>

        <h1>Espace d'administration</h1>
        <p>
          Connectez-vous pour retrouver vos articles sur tous vos appareils.
        </p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label className="admin-field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            'Connexion…'
          ) : (
            <>
              Se connecter <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
