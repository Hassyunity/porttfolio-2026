import React, { useCallback, useEffect, useState } from 'react';
import { CircleOff, ExternalLink, Eye, Globe, KeyRound, Lock, Pencil, RefreshCw, Rocket } from 'lucide-react';
import { FORMULAS, FORMULA_LIST } from '../altea/formulas';
import { ALTEA_DOMAIN, SITES, type AlteaSiteMeta } from '../altea/registry';
import {
  CYCLE_LABEL, PAYMENT_LABEL, STATUS_LABEL, checkPassword, formatEuros, isPasswordConfigured, isUnlocked, listSiteRows,
  lock, monthlyAmount, publicUrl, publishSite, saveSubscription, suspendSite,
  type BillingCycle, type PaymentStatus, type SiteRow, type Subscription,
} from './alteaApi';
import { formatDateTime } from './adminApi';

const formatDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

const toSubscription = (row: SiteRow | undefined): Subscription => ({
  price: row?.price ?? null,
  billing_cycle: row?.billing_cycle ?? 'monthly',
  subscription_start: row?.subscription_start ?? null,
  next_payment: row?.next_payment ?? null,
  payment_status: row?.payment_status ?? 'pending',
  notes: row?.notes ?? '',
});

// --- Verrou --------------------------------------------------------------------
const AlteaLock: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await checkPassword(password)) return onUnlock();
    setError('Mot de passe incorrect.');
    setPassword('');
  };

  return (
    <main className="admin-main">
      <form className="admin-card admin-login altea-lock" onSubmit={submit}>
        <span className="admin-login-icon"><KeyRound size={18} /></span>
        <h1>Altea</h1>
        {isPasswordConfigured() ? (
          <>
            <p>Espace de pilotage de l'agence : saisissez le mot de passe Altea.</p>
            <label className="admin-field">
              <span>Mot de passe</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off" required autoFocus />
            </label>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn-primary">Entrer</button>
          </>
        ) : (
          <p className="admin-error">Mot de passe non configuré : ajoutez <code>VITE_ALTEA_PASSWORD_SHA256</code> dans <code>.env.local</code> puis relancez.</p>
        )}
      </form>
    </main>
  );
};

// --- Formulaire d'abonnement ------------------------------------------------------
const SubscriptionForm: React.FC<{ row: SiteRow | undefined; busy: boolean; onSave: (value: Subscription) => void; onCancel: () => void }> = ({ row, busy, onSave, onCancel }) => {
  const [form, setForm] = useState<Subscription>(() => toSubscription(row));
  const update = (patch: Partial<Subscription>) => setForm(current => ({ ...current, ...patch }));

  return (
    <form className="altea-sub-form" onSubmit={event => { event.preventDefault(); onSave(form); }}>
      <label className="admin-field">
        <span>Prix (€)</span>
        <input type="number" min="0" step="0.01" inputMode="decimal" value={form.price ?? ''} onChange={e => update({ price: e.target.value === '' ? null : Number(e.target.value) })} />
      </label>
      <label className="admin-field">
        <span>Facturation</span>
        <select value={form.billing_cycle} onChange={e => update({ billing_cycle: e.target.value as BillingCycle })}>
          <option value="monthly">Mensuelle</option>
          <option value="yearly">Annuelle</option>
        </select>
      </label>
      <label className="admin-field">
        <span>Début</span>
        <input type="date" value={form.subscription_start ?? ''} onChange={e => update({ subscription_start: e.target.value || null })} />
      </label>
      <label className="admin-field">
        <span>Prochain paiement</span>
        <input type="date" value={form.next_payment ?? ''} onChange={e => update({ next_payment: e.target.value || null })} />
      </label>
      <label className="admin-field">
        <span>Paiement</span>
        <select value={form.payment_status} onChange={e => update({ payment_status: e.target.value as PaymentStatus })}>
          {(Object.keys(PAYMENT_LABEL) as PaymentStatus[]).map(key => <option key={key} value={key}>{PAYMENT_LABEL[key]}</option>)}
        </select>
      </label>
      <label className="admin-field altea-sub-notes">
        <span>Notes</span>
        <textarea rows={3} maxLength={5000} value={form.notes} onChange={e => update({ notes: e.target.value })} placeholder="Contact, échanges, demandes de modification…" />
      </label>
      <div className="altea-sub-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
};

// --- Fiche d'un site client ---------------------------------------------------------
const SiteCard: React.FC<{ site: AlteaSiteMeta; row: SiteRow | undefined; onChange: (row: SiteRow) => void }> = ({ site, row, onChange }) => {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const status = row?.status ?? 'draft';
  const url = publicUrl(site);

  const run = async (task: () => Promise<SiteRow>) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await task());
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  const publish = () => {
    if (window.confirm(`Mettre « ${site.name} » en ligne ? Il sera visible par tout le monde${url ? ` sur ${url}` : ''}.`)) run(() => publishSite(site.slug));
  };
  const suspend = () => {
    if (window.confirm(`Suspendre « ${site.name} » ? Les visiteurs verront « site momentanément indisponible ».`)) run(() => suspendSite(site.slug));
  };

  return (
    <li className="altea-site">
      <div className="altea-site-head">
        <div>
          <h2>{site.name}</h2>
          <p className="admin-row-meta">
            {site.client.company}{site.client.city && ` · ${site.client.city}`}
            {site.client.contact && ` · ${site.client.contact}`}
          </p>
        </div>
        <div className="altea-badges">
          {site.demo && <span className="admin-badge is-draft">Démo</span>}
          <span className="admin-badge altea-formula">{FORMULAS[site.formula].name}</span>
          <span className={`admin-badge is-${status === 'published' ? 'succeeded' : status === 'suspended' ? 'failed' : 'draft'}`}>{STATUS_LABEL[status]}</span>
        </div>
      </div>

      <div className="altea-site-url">
        <Globe size={14} />
        {url ? <a href={status === 'published' ? url : `${url}?apercu`} target="_blank" rel="noopener noreferrer">{url}</a> : <span>Définissez VITE_SITE_URL pour obtenir le lien.</span>}
        {status === 'published' && row?.published_at && <span className="admin-muted">en ligne depuis le {formatDateTime(row.published_at)}</span>}
        {status === 'suspended' && row?.suspended_at && <span className="admin-muted">suspendu le {formatDateTime(row.suspended_at)}</span>}
      </div>

      <div className="altea-site-actions">
        {status === 'published' ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={suspend} disabled={busy}><CircleOff size={14} /> Suspendre le site</button>
        ) : (
          <button type="button" className="btn btn-primary btn-sm" onClick={publish} disabled={busy}>
            <Rocket size={14} /> {status === 'suspended' ? 'Réactiver' : 'Publier'}
          </button>
        )}
        {url && status !== 'published' && (
          <a href={`${url}?apercu`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Eye size={14} /> Aperçu</a>
        )}
        {url && status === 'published' && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink size={14} /> Voir le site</a>
        )}
      </div>

      <div className="altea-sub">
        <div className="altea-sub-summary">
          <span><strong>{row?.price != null ? formatEuros(row.price) : 'Prix non défini'}</strong>{row?.price != null && ` ${CYCLE_LABEL[row.billing_cycle]}`}</span>
          <span className={`altea-pay is-${row?.payment_status ?? 'pending'}`}>{PAYMENT_LABEL[row?.payment_status ?? 'pending']}</span>
          <span className="admin-muted">Début : {formatDate(row?.subscription_start ?? null)} · Prochain paiement : {formatDate(row?.next_payment ?? null)}</span>
          {!editing && <button type="button" className="admin-link" onClick={() => setEditing(true)}><Pencil size={13} /> Abonnement</button>}
        </div>
        {row?.notes && !editing && <p className="altea-notes">{row.notes}</p>}
        {editing && (
          <SubscriptionForm
            row={row}
            busy={busy}
            onCancel={() => setEditing(false)}
            onSave={value => run(() => saveSubscription(site.slug, value)).then(ok => { if (ok) setEditing(false); })}
          />
        )}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
    </li>
  );
};

// --- Page ----------------------------------------------------------------------------
const AlteaPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [rows, setRows] = useState<Map<string, SiteRow> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    listSiteRows().then(map => { setRows(map); setError(null); }).catch((err: Error) => setError(err.message));
  }, []);

  useEffect(() => { if (unlocked) refresh(); }, [unlocked, refresh]);

  if (!unlocked) return <AlteaLock onUnlock={() => setUnlocked(true)} />;

  const rowOf = (slug: string) => rows?.get(slug);
  const count = (status: SiteRow['status']) => SITES.filter(site => (rowOf(site.slug)?.status ?? 'draft') === status).length;
  const mrr = SITES.reduce((sum, site) => sum + (rowOf(site.slug)?.status === 'published' ? monthlyAmount(rowOf(site.slug)) : 0), 0);
  const late = SITES.filter(site => rowOf(site.slug)?.payment_status === 'late').length;

  return (
    <main className="admin-main">
      <div className="admin-container">
        <div className="admin-head">
          <div>
            <p className="eyebrow">Altea · agence</p>
            <h1 className="admin-title">Sites clients</h1>
          </div>
          <div className="admin-toolbar">
            <button type="button" className="icon-btn" onClick={refresh} aria-label="Actualiser" title="Actualiser"><RefreshCw size={15} /></button>
            <button type="button" className="icon-btn" onClick={() => { lock(); setUnlocked(false); }} aria-label="Verrouiller" title="Verrouiller"><Lock size={15} /></button>
          </div>
        </div>

        <div className="admin-stats altea-stats">
          <div className="admin-stat"><strong>{count('published')}</strong><span>En ligne</span></div>
          <div className="admin-stat"><strong>{count('suspended')}</strong><span>Suspendus</span></div>
          <div className="admin-stat"><strong>{count('draft')}</strong><span>En préparation</span></div>
          <div className="admin-stat"><strong>{formatEuros(mrr)}</strong><span>Revenu mensuel</span></div>
          <div className="admin-stat"><strong>{late}</strong><span>Paiements en retard</span></div>
        </div>

        {!ALTEA_DOMAIN && (
          <p className="admin-muted">
            Aucun domaine Altea branché : les sites sont servis sur <code>/sites/&lt;nom&gt;</code> du portfolio.
            Une fois le domaine acheté, renseignez <code>VITE_ALTEA_DOMAIN</code> pour les adresses en <code>nom.domaine</code>.
          </p>
        )}

        {error && <p className="admin-error" role="alert">{error}</p>}

        {rows === null && !error ? (
          <p className="admin-muted">Chargement des sites…</p>
        ) : (
          <ul className="altea-sites">
            {SITES.map(site => (
              <SiteCard key={site.slug} site={site} row={rowOf(site.slug)} onChange={row => setRows(current => new Map(current ?? []).set(row.slug, row))} />
            ))}
          </ul>
        )}

        <section className="altea-formulas">
          <h2 className="agent-runs-title">Formules</h2>
          <ul>
            {FORMULA_LIST.map(formula => (
              <li key={formula.id}>
                <h3>{formula.name}</h3>
                <p>{formula.pitch}</p>
                <ul>{formula.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
              </li>
            ))}
          </ul>
        </section>

        <p className="admin-muted altea-howto">
          Nouveau client : créez son dossier dans <code>src/altea/sites/</code>, ajoutez-le à <code>src/altea/registry.ts</code>, déployez,
          puis publiez-le ici. Les modifications de contenu se font dans le code ; la publication et la suspension sont immédiates.
        </p>
      </div>
    </main>
  );
};

export default AlteaPage;
