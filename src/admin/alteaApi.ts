import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { siteUrl } from '../lib/platform';
import { ALTEA_DOMAIN, type AlteaSiteMeta } from '../altea/registry';

// Altea : statut et abonnement des sites clients (table altea_sites, voir supabase/altea.sql).
// Le contenu des sites, lui, est dans le code : src/altea/sites/<slug>/.

export type SiteStatus = 'draft' | 'published' | 'suspended';
export type PaymentStatus = 'pending' | 'paid' | 'late' | 'cancelled';
export type BillingCycle = 'monthly' | 'yearly';

export interface SiteRow {
  slug: string;
  status: SiteStatus;
  published_at: string | null;
  suspended_at: string | null;
  price: number | null;
  billing_cycle: BillingCycle;
  subscription_start: string | null;
  next_payment: string | null;
  payment_status: PaymentStatus;
  notes: string;
  updated_at: string;
}

export type Subscription = Pick<SiteRow, 'price' | 'billing_cycle' | 'subscription_start' | 'next_payment' | 'payment_status' | 'notes'>;

export const STATUS_LABEL: Record<SiteStatus, string> = { draft: 'Brouillon', published: 'En ligne', suspended: 'Suspendu' };
export const PAYMENT_LABEL: Record<PaymentStatus, string> = { pending: 'En attente', paid: 'À jour', late: 'En retard', cancelled: 'Résilié' };
export const CYCLE_LABEL: Record<BillingCycle, string> = { monthly: 'par mois', yearly: 'par an' };

const COLUMNS = 'slug, status, published_at, suspended_at, price, billing_cycle, subscription_start, next_payment, payment_status, notes, updated_at';

function client() {
  if (!supabase) throw new Error('Supabase n\'est pas configuré (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  return supabase;
}

function fail(error: PostgrestError): never {
  if (error.code === '42P01' || error.code === 'PGRST205') throw new Error('La table altea_sites n\'existe pas : exécutez supabase/altea.sql dans Supabase.');
  if (error.code === '42501' || error.code === 'PGRST301') throw new Error('Accès refusé : votre compte n\'a pas les droits d\'administration.');
  if (error.code === '23514') throw new Error('Données invalides : vérifiez le prix et les dates.');
  throw new Error(error.message || 'Erreur réseau : vérifiez votre connexion.');
}

export async function listSiteRows(): Promise<Map<string, SiteRow>> {
  const { data, error } = await client().from('altea_sites').select(COLUMNS);
  if (error) fail(error);
  return new Map((data as SiteRow[]).map(row => [row.slug, row]));
}

/** Crée la ligne du site si besoin (un site existe d'abord dans le code), sinon la met à jour. */
async function upsert(slug: string, patch: Partial<SiteRow>): Promise<SiteRow> {
  const { data, error } = await client().from('altea_sites').upsert({ slug, ...patch }, { onConflict: 'slug' }).select(COLUMNS).single();
  if (error) fail(error);
  return data as SiteRow;
}

export const publishSite = (slug: string) => upsert(slug, { status: 'published', published_at: new Date().toISOString(), suspended_at: null });
export const suspendSite = (slug: string) => upsert(slug, { status: 'suspended', suspended_at: new Date().toISOString() });
export const saveSubscription = (slug: string, subscription: Subscription) => upsert(slug, subscription);

/** Adresse publique du site : sous-domaine Altea si un domaine est branché, sinon /sites/<slug> du portfolio. */
export const publicUrl = (site: AlteaSiteMeta) =>
  ALTEA_DOMAIN ? `https://${site.subdomain}.${ALTEA_DOMAIN}` : siteUrl(`/sites/${site.slug}`);

/** Montant mensuel équivalent (pour le revenu récurrent). */
export const monthlyAmount = (row: SiteRow | undefined) =>
  !row?.price || row.payment_status === 'cancelled' ? 0 : row.billing_cycle === 'yearly' ? row.price / 12 : row.price;

export const formatEuros = (value: number) =>
  value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: value % 1 ? 2 : 0 });

// --- Accès par mot de passe ------------------------------------------------------
// Seule l'empreinte SHA-256 du mot de passe est dans le code (VITE_ALTEA_PASSWORD_SHA256).
// C'est un second verrou : la vraie protection des données reste la connexion admin + RLS.
const UNLOCK_KEY = 'altea-unlocked';

async function sha256(text: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export const isPasswordConfigured = () => Boolean(import.meta.env.VITE_ALTEA_PASSWORD_SHA256);

export async function checkPassword(password: string) {
  const ok = (await sha256(password)) === String(import.meta.env.VITE_ALTEA_PASSWORD_SHA256 ?? '').toLowerCase();
  if (ok) try { sessionStorage.setItem(UNLOCK_KEY, '1'); } catch { /* stockage indisponible */ }
  return ok;
}

export function isUnlocked() {
  try { return sessionStorage.getItem(UNLOCK_KEY) === '1'; } catch { return false; }
}

export function lock() {
  try { sessionStorage.removeItem(UNLOCK_KEY); } catch { /* stockage indisponible */ }
}
