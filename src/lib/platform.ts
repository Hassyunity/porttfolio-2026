import { Capacitor } from '@capacitor/core';

/** Vrai dans l'application Android (Capacitor), faux dans le navigateur. */
export const isNative = Capacitor.isNativePlatform();

// Dans l'app, les chemins relatifs pointeraient vers l'app elle-même : on vise le site public.
const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '');

/** Adresse publique d'une page du site, ou null si elle n'est pas joignable depuis l'app. */
export const siteUrl = (path: string) => (SITE_URL ? SITE_URL + path : isNative ? null : path);
