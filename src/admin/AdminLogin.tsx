import React, { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { signIn } from './auth';

const AdminLogin: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    // Délai croissant après chaque échec pour freiner les essais en série
    await new Promise(resolve => setTimeout(resolve, Math.min(attempts, 6) * 500));
    if (await signIn(password)) {
      onSuccess();
      return;
    }
    setAttempts(count => count + 1);
    setPassword('');
    setError('Mot de passe incorrect.');
    setLoading(false);
  };

  return (
    <div className="admin-gate">
      <form className="admin-card admin-login" onSubmit={submit}>
        <span className="admin-login-icon"><Lock size={18} /></span>
        <h1>Espace d'administration</h1>
        <p>Entrez votre mot de passe pour écrire et publier vos articles.</p>

        <label className="admin-field">
          <span>Mot de passe</span>
          <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
        </label>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Vérification…' : <>Entrer <ArrowRight size={16} /></>}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
