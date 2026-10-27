# README tactique — Studio blog mobile & Agent IA développeur

Archive de tout ce qui a été mis en place autour de l'espace `/admin` du portfolio :

1. **L'application Android** (APK) de l'admin du blog.
2. **L'agent IA développeur**, un « second développeur senior » piloté depuis l'admin, qui code sur GitHub et propose ses changements en Pull Request.

Ce document sert à la fois de tutoriel (refaire l'installation de zéro), d'aide-mémoire (où se trouve chaque réglage) et de guide de dépannage (problèmes déjà rencontrés et leur solution).

> **Règle d'or :** aucun secret (token, clé, mot de passe) ne doit être écrit dans ce fichier, dans le code ou dans un message. Ils vivent uniquement dans les coffres prévus : secrets GitHub, secrets Supabase, `.env.local` (non versionné).

---

## Sommaire

- [1. Vue d'ensemble](#1-vue-densemble)
- [2. Carte des fichiers](#2-carte-des-fichiers)
- [3. Prérequis](#3-prérequis)
- [4. Application Android (APK)](#4-application-android-apk)
- [5. Agent IA : installation pas à pas](#5-agent-ia--installation-pas-à-pas)
- [6. Utiliser l'agent au quotidien](#6-utiliser-lagent-au-quotidien)
- [7. Où va chaque valeur (tableau récapitulatif)](#7-où-va-chaque-valeur-tableau-récapitulatif)
- [8. Dépannage : problèmes déjà rencontrés](#8-dépannage--problèmes-déjà-rencontrés)
- [9. Sécurité](#9-sécurité)
- [10. Maintenance et échéances](#10-maintenance-et-échéances)

---

## 1. Vue d'ensemble

### Les briques

| Brique | Rôle | Où |
|---|---|---|
| **Admin web** | Écrire, publier, programmer les articles ; piloter l'agent | `https://hassy.is-a.dev/admin` (Netlify) |
| **App Android** | Le même admin, empaqueté en APK avec Capacitor | `dist-apk/studio-blog.apk` |
| **Supabase** | Base de données, connexion, droits admin, Edge Function | projet `viaeglmpkyfaxjodepgi` |
| **GitHub Actions** | Machine qui fait tourner l'agent | dépôt `Hassyunity/porttfolio-2026` |
| **Claude Code** | Le « cerveau » de l'agent, sur l'abonnement Claude | installé à chaque exécution |

### Le parcours d'une exécution de l'agent

```
 App admin (web ou Android)
   │  1. vous écrivez une consigne → enregistrée dans agent_scripts
   │  2. bouton « Exécuter »
   ▼
 Edge Function Supabase (super-handler)
   │  vérifie que vous êtes admin (is_blog_admin)
   │  crée une ligne dans agent_runs (statut « En file »)
   │  demande à GitHub de lancer le workflow (avec le token GitHub, gardé côté serveur)
   ▼
 GitHub Actions — workflow « Agent IA » (.github/workflows/ai-agent.yml)
   │  3. lit la tâche dans Supabase → statut « En cours »
   │  4. clone le dépôt cible
   │  5. Claude Code travaille : code, build, lint, tests
   │  6. commit + push sur une branche agent/… + ouverture d'une Pull Request
   │  7. écrit le compte rendu et le lien de la PR dans Supabase → « Terminé » ou « Échec »
   ▼
 App admin : l'historique se met à jour toutes les 4 s
   → vous relisez la Pull Request sur GitHub et la fusionnez (ou non)
```

**Choix faits et pourquoi :**

- **GitHub Actions** plutôt qu'un PC allumé en permanence : rien à héberger, chaque exécution part d'une machine propre.
- **Dépôt existant + Pull Request** : l'agent ne fusionne jamais rien lui-même, c'est vous qui validez.
- **Abonnement Claude** (`CLAUDE_CODE_OAUTH_TOKEN`) plutôt qu'une clé API : aucune facturation à l'usage, les exécutions sont décomptées des limites du forfait, comme dans VS Code.
- **Edge Function** entre l'app et GitHub : le token GitHub ne se trouve jamais dans l'app, qu'on pourrait décompiler.

---

## 2. Carte des fichiers

### Application Android

| Fichier | Rôle |
|---|---|
| `capacitor.config.ts` | Identité de l'app (`com.hassytsihoarana.studioblog`, « Studio blog »), dossier web, couleurs |
| `vite.admin.config.ts` | Build web dédié à l'app : uniquement l'admin, sortie dans `dist-admin/` |
| `mobile/index.html` | Page d'entrée de l'app (viewport bord à bord) |
| `src/admin/mobile.tsx` | Point d'entrée React de l'app : HashRouter, bouton retour Android |
| `src/admin/AdminMobile.css` | Réglages propres au mobile : zones sûres, cibles tactiles, pas de zoom |
| `src/lib/platform.ts` | `isNative` (app ou navigateur) et `siteUrl()` (liens vers le site public) |
| `scripts/build-apk.sh` | Construit l'APK release signé ; crée la clé de signature au premier lancement |
| `assets/` | Images sources de l'icône et de l'écran de démarrage |
| `android/` | Projet Android natif généré par Capacitor |

### Agent IA

| Fichier | Rôle |
|---|---|
| `supabase/agent.sql` | Tables `agent_scripts` et `agent_runs` + sécurité RLS (admins seulement) |
| `supabase/functions/agent-dispatch/index.ts` | Code de l'Edge Function (déployée sous le nom `super-handler`) |
| `.github/workflows/ai-agent.yml` | Le workflow GitHub Actions qui fait tourner l'agent |
| `.github/agent/agent.mjs` | Liaison workflow ↔ Supabase (début et fin d'exécution) |
| `src/admin/agentApi.ts` | Accès aux données et appel de l'Edge Function côté app |
| `src/admin/AgentDashboard.tsx` | Écran « Agent IA » : liste des scripts |
| `src/admin/AgentScript.tsx` | Écran d'un script : consigne, Enregistrer, Exécuter, historique |
| `src/admin/AdminApp.tsx` | Menu « Articles / Agent IA » et routes |

### Fichiers sensibles, jamais versionnés

| Fichier | Contenu | À faire |
|---|---|---|
| `.env.local` | Configuration locale (URL et clé publique Supabase, etc.) | Ne pas partager |
| `android/studio-blog-release.jks` | Clé de signature de l'APK | **Sauvegarder hors du PC** |
| `android/keystore.properties` | Mots de passe de cette clé | **Sauvegarder avec la clé** |

---

## 3. Prérequis

| Outil | Emplacement sur ce PC | Remarque |
|---|---|---|
| Node.js / npm | dans le PATH | Node 22 |
| JDK 21 | `~/jdk21` | **Pas dans le PATH** : le script le trouve tout seul |
| SDK Android | `~/Android/Sdk` | build-tools 35/36, plateforme android-36 |
| ImageMagick | `magick` | seulement pour régénérer l'icône |

Comptes nécessaires :

- **GitHub** `Hassyunity` (propriétaire du dépôt) ;
- **Supabase**, avec accès au projet `viaeglmpkyfaxjodepgi` ;
- **Claude**, avec un abonnement (le même que dans VS Code) ;
- **Netlify** (hébergement de `hassy.is-a.dev`).

---

## 4. Application Android (APK)

### 4.1 Ce que fait l'app

Exactement les mêmes actions que `/admin`, puisque c'est le même code :

- connexion Supabase et vérification du droit admin ;
- articles : écrire, prévisualiser, enregistrer un brouillon, publier, programmer, dépublier, supprimer, tags, slug, Markdown ;
- export et import de sauvegarde (l'export passe par le menu de partage Android) ;
- menu **Agent IA**.

Adaptations propres au mobile :

- bouton retour Android (revient en arrière, quitte l'app depuis la liste) ;
- brouillon sauvegardé dès que l'app passe en arrière-plan ;
- rafraîchissement automatique au retour dans l'app ;
- sauvegarde Android désactivée (la session ne part pas dans le cloud Google) ;
- APK minifié (R8), environ 1,9 Mo.

### 4.2 Configuration `.env.local`

Le build de l'APK lit `.env.local` à la racine du projet :

```dotenv
VITE_SUPABASE_URL=https://viaeglmpkyfaxjodepgi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_…        # la MÊME clé que sur Netlify
VITE_SITE_URL=https://hassy.is-a.dev            # liens « Voir le blog » dans l'app
VITE_AGENT_DEFAULT_REPO=Hassyunity/porttfolio-2026
VITE_AGENT_FUNCTION=super-handler               # nom réel de l'Edge Function
```

> ⚠️ Cette clé publishable doit être **identique** à celle de Netlify (Site configuration › Environment variables). Une ancienne clé dans `.env.local` donnait « Invalid API key » dans l'app alors que le site marchait (voir [8.1](#81-invalid-api-key-dans-lapp-alors-que-le-site-marche)).

### 4.3 Construire l'APK

```bash
cd /home/hassy/Documents/porttfolio-2026
npm run android:apk
```

Ce que fait la commande :

1. `npm run build:admin` : build web de l'admin seul vers `dist-admin/` ;
2. `cap sync android` : copie dans le projet Android ;
3. `scripts/build-apk.sh` :
   - trouve le JDK (`~/jdk21`) et le SDK (`~/Android/Sdk`) ;
   - au **premier** lancement seulement, crée la clé de signature `android/studio-blog-release.jks` et `android/keystore.properties` ;
   - lance `./gradlew assembleRelease` ;
   - copie le résultat dans **`dist-apk/studio-blog.apk`**.

Autres commandes utiles :

| Commande | Effet |
|---|---|
| `npm run build:admin` | Build web de l'admin seulement |
| `npm run android:sync` | Build web + copie dans `android/` (sans APK) |
| `npm run android:apk` | Tout, jusqu'à l'APK signé |

### 4.4 Publier une nouvelle version

1. Dans `android/app/build.gradle`, **augmenter** `versionCode` (entier : 4 → 5…) et `versionName` (texte : "1.3" → "1.4").
2. `npm run android:apk`.
3. Installer le nouvel APK **par-dessus** l'ancien, sans désinstaller.

Historique : 1.0 (première version) · 1.1 (bonne clé Supabase + `VITE_SITE_URL`) · 1.2 (menu Agent IA) · 1.3 (nom de fonction `super-handler`).

### 4.5 Installer sur le téléphone

- **Câble USB** : copier `dist-apk/studio-blog.apk` dans « Téléchargements », puis l'ouvrir depuis l'app Fichiers ;
- **Sans câble** : l'envoyer par Drive, Telegram ou mail, puis l'ouvrir sur le téléphone ;
- **adb** (débogage USB activé) : `~/Android/Sdk/platform-tools/adb install -r dist-apk/studio-blog.apk`.

À la première installation, autoriser « Installer des applications inconnues » pour l'app qui ouvre le fichier.

### 4.6 Icône et écran de démarrage

Sources dans `assets/`, générées depuis `public/lg.png` (logo « HT ») : fond clair pour l'icône, pastille claire sur fond sombre pour le démarrage. Pour les régénérer :

```bash
npx @capacitor/assets@3 generate --android \
  --iconBackgroundColor '#f5f4f5' --iconBackgroundColorDark '#f5f4f5' \
  --splashBackgroundColor '#08080a' --splashBackgroundColorDark '#08080a'
```

---

## 5. Agent IA : installation pas à pas

L'ordre compte : base de données → token GitHub → jeton Claude → secrets GitHub → Edge Function → code poussé → test.

### Étape 1 — Créer les tables dans Supabase

1. Ouvrir **https://supabase.com/dashboard/project/viaeglmpkyfaxjodepgi/sql/new**.
2. Coller tout le contenu de `supabase/agent.sql`, puis cliquer sur **Run** : on doit voir « Success. No rows returned ».

Prérequis : `supabase/blog_posts.sql` doit avoir été exécuté avant, car il crée la fonction `is_blog_admin()`.

Ce que crée le script :

- `agent_scripts` : titre, consigne, dépôt (`propriétaire/nom`), branche de départ ;
- `agent_runs` : chaque exécution, avec une **copie** de la consigne, le statut (`queued`, `running`, `succeeded`, `failed`, `cancelled`), la branche, la PR, le lien des logs, le compte rendu et l'erreur ;
- RLS : seuls les admins (`is_blog_admin()`) lisent et écrivent ; l'accès anonyme est révoqué.

Si l'app dit encore que les tables n'existent pas, lancer `notify pgrst, 'reload schema';` dans le SQL Editor.

### Étape 2 — Créer le token GitHub (`AGENT_GITHUB_TOKEN`)

1. Connecté en **Hassyunity**, ouvrir **https://github.com/settings/personal-access-tokens/new** (Fine-grained token).
2. Remplir :
   - **Token name** : `agent-ia` ;
   - **Expiration** : 90 jours, par exemple (noter la date, voir [§10](#10-maintenance-et-échéances)) ;
   - **Repository access** : *Only select repositories* › `porttfolio-2026`, plus tout autre dépôt que l'agent doit pouvoir modifier.
3. Dans **Repository permissions**, mettre ces trois lignes sur **Read and write** :
   - **Actions** (lancer et annuler le workflow) ;
   - **Contents** (pousser la branche) ;
   - **Pull requests** (ouvrir la PR).
4. **Generate token** → copier immédiatement le `github_pat_…` : GitHub ne le réaffiche jamais.

Ce même token sert à deux endroits : secrets GitHub (étape 4) et secrets Supabase (étape 5).

### Étape 3 — Créer le jeton de l'abonnement Claude (`CLAUDE_CODE_OAUTH_TOKEN`)

Dans le terminal de VS Code :

```bash
npx @anthropic-ai/claude-code setup-token
```

1. Le navigateur s'ouvre : se connecter avec **le même compte Claude que dans VS Code**.
2. Le terminal affiche un jeton `sk-ant-oat01-…` : le copier en entier.

Notes :

- la commande `claude` n'est pas installée globalement sur ce PC, d'où le `npx` ;
- le jeton est valable environ **un an** ;
- le workflow n'utilise **que** ce jeton : il ne lit jamais `ANTHROPIC_API_KEY`, donc aucune facturation à l'usage n'est possible.

### Étape 4 — Secrets GitHub du dépôt

Ouvrir **https://github.com/Hassyunity/porttfolio-2026/settings/secrets/actions** › **New repository secret**, et ajouter :

| Name | Secret |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | le jeton `sk-ant-oat01-…` (étape 3) |
| `AGENT_GITHUB_TOKEN` | le `github_pat_…` (étape 2) |
| `SUPABASE_URL` | `https://viaeglmpkyfaxjodepgi.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase › Project Settings › **API Keys** › clé **secret** `sb_secret_…` (bouton « Reveal ») |

Variable facultative (onglet **Variables**, pas Secrets) : `AGENT_MODEL` pour imposer un modèle Claude précis. Sans elle, c'est le modèle par défaut de Claude Code.

### Étape 5 — Déployer l'Edge Function

> ⚠️ Vérifier qu'on est bien sur **Supabase** (supabase.com), dans le **bon projet** (`viaeglmpkyfaxjodepgi` dans l'adresse), et pas sur Render ni dans un autre projet.

**Option A — tableau de bord (méthode utilisée) :**

1. Ouvrir **https://supabase.com/dashboard/project/viaeglmpkyfaxjodepgi/functions**.
2. **Deploy a new function** › **Via Editor**.
3. **Effacer entièrement le code d'exemple** (la fonction « Hello name » avec `withSupabase`), puis coller tout `supabase/functions/agent-dispatch/index.ts`.
4. **Nom de la fonction** : idéalement `agent-dispatch`. Sinon, Supabase génère un nom aléatoire ; c'est ce qui est arrivé, la fonction s'appelle **`super-handler`**. Dans ce cas, mettre ce nom dans `VITE_AGENT_FUNCTION` (voir [8.4](#84-impossible-de-joindre-ledge-function-alors-quelle-est-déployée)).
5. **Deploy function**.
6. Dans **Details** de la fonction : désactiver **« Verify JWT with legacy secret »**, puis enregistrer. La fonction vérifie elle-même que l'appelant est admin.
7. Secrets de la fonction : **https://supabase.com/dashboard/project/viaeglmpkyfaxjodepgi/functions/secrets**

   | Name | Value |
   |---|---|
   | `AGENT_GITHUB_TOKEN` | le `github_pat_…` |
   | `AGENT_WORKFLOW_REPO` | `Hassyunity/porttfolio-2026` |
   | `AGENT_WORKFLOW_REF` | `Production` |
   | `AGENT_ALLOWED_REPOS` | `Hassyunity/porttfolio-2026` (plusieurs : séparés par des virgules) |

**Option B — ligne de commande :**

```bash
cd /home/hassy/Documents/porttfolio-2026
npx supabase login
npx supabase secrets set --project-ref viaeglmpkyfaxjodepgi \
  AGENT_GITHUB_TOKEN=<token> AGENT_WORKFLOW_REPO=Hassyunity/porttfolio-2026 \
  AGENT_WORKFLOW_REF=Production AGENT_ALLOWED_REPOS=Hassyunity/porttfolio-2026
npx supabase functions deploy agent-dispatch --project-ref viaeglmpkyfaxjodepgi --no-verify-jwt
```

Avec la CLI, la fonction prend le nom du dossier (`agent-dispatch`). Il faudrait alors remettre `VITE_AGENT_FUNCTION=agent-dispatch`.

**Vérifier que la fonction répond** (remplacer le nom si besoin) :

```bash
curl -s -X POST -H "apikey: <clé publishable>" -H 'Content-Type: application/json' \
  -d '{}' https://viaeglmpkyfaxjodepgi.supabase.co/functions/v1/super-handler
```

| Réponse | Signification |
|---|---|
| `{"error":"Accès refusé : réservé aux administrateurs."}` | ✅ La fonction tourne : c'est le refus attendu pour un appel non connecté |
| `{"code":"NOT_FOUND",…}` | ❌ Aucune fonction sous ce nom dans ce projet |
| Erreur 401 avant notre message | ❌ « Verify JWT » est encore activé |

### Étape 6 — Pousser le code sur `Production`

GitHub ne peut lancer un workflow par API que s'il se trouve sur la **branche par défaut** (`Production`).

```bash
git add -A && git commit -m "…" && git push origin Production
```

Vérifier qu'il est reconnu : dépôt › onglet **Actions** › le workflow **« Agent IA »** apparaît dans la liste de gauche.

Ce push redéploie aussi le site sur Netlify. Pour l'admin web, ajouter dans Netlify › Site configuration › **Environment variables** :

| Clé | Valeur |
|---|---|
| `VITE_AGENT_FUNCTION` | `super-handler` |
| `VITE_AGENT_DEFAULT_REPO` | `Hassyunity/porttfolio-2026` (facultatif) |

### Étape 7 — Premier test

1. Ouvrir l'app (ou `/admin`) › onglet **Agent IA** › **Nouveau script**.
2. Remplir :
   - **Titre** : `Test README` ;
   - **Dépôt** : `Hassyunity/porttfolio-2026` ;
   - **Branche** : laisser vide (branche par défaut du dépôt) ;
   - **Consigne** : `Ajoute au README une section expliquant comment lancer le projet en local.`
3. **Exécuter** : le statut passe « En file » → « En cours » (environ 30 s) → « Terminé ».
4. Ouvrir le lien **Pull Request**, relire, fusionner ou fermer.

---

## 6. Utiliser l'agent au quotidien

### Écrire une bonne consigne

L'agent se comporte comme un développeur senior autonome. Plus la consigne est précise, meilleur est le résultat :

```
But : ajouter une page « Témoignages » au portfolio.

Contexte : les pages sont dans src/pages, les données dans src/data/portfolio.ts,
le style suit Experience.css.

À faire :
- créer src/pages/Testimonials.tsx et son CSS
- ajouter la route /temoignages et le lien dans la navigation
- 3 témoignages d'exemple dans src/data

Contraintes : pas de nouvelle librairie, textes en français, responsive mobile.

Fini quand : npm run build et npm run lint passent.
```

Ce que l'agent fait toujours, grâce au prompt système du workflow :

- il respecte les conventions du dépôt ;
- il installe les dépendances et lance build, lint et tests, puis corrige ce qu'il casse ;
- il ne pousse rien et n'ouvre pas la PR lui-même (le workflow s'en charge) ;
- il termine par un **compte rendu en français** : ce qui a été fait, les fichiers touchés, comment tester et les points à vérifier. Ce compte rendu s'affiche dans l'app et sert de description à la PR.

### Les statuts dans l'app

| Badge | Signification |
|---|---|
| **Jamais lancé** | Script enregistré, aucune exécution |
| **En file** | Demande envoyée à GitHub, machine en démarrage |
| **En cours** | L'agent travaille (le point clignote) |
| **Terminé** | Fini : PR ouverte, ou « Aucune modification de code » |
| **Échec** | Erreur : lire le message, puis **Logs GitHub** pour le détail |
| **Annulé** | Arrêté avec le bouton **Arrêter** |

### Bon à savoir

- Un script est **réutilisable** : modifier la consigne puis relancer. Chaque exécution garde sa propre copie de la consigne.
- **Une exécution à la fois par script** : le bouton Exécuter est désactivé tant qu'une exécution tourne.
- **Durée maximale** : 60 minutes et 120 tours d'agent par exécution.
- **Pas de logs en direct dans l'app** : seulement le statut, puis le compte rendu final. Le détail complet est dans **Logs GitHub**.
- Supprimer un script supprime son historique, mais **pas** les PR déjà ouvertes sur GitHub.

### Travailler sur un autre dépôt

1. Donner au token GitHub l'accès à ce dépôt : github.com › Settings › Fine-grained tokens › `agent-ia` › Repository access.
2. L'ajouter à `AGENT_ALLOWED_REPOS` dans les secrets Supabase (séparé par une virgule).
3. Dans le script, mettre `propriétaire/nom-du-dépôt`.

---

## 7. Où va chaque valeur (tableau récapitulatif)

| Où | Nom | Valeur | Source |
|---|---|---|---|
| **GitHub** › Secrets › Actions | `CLAUDE_CODE_OAUTH_TOKEN` | `sk-ant-oat01-…` | `npx @anthropic-ai/claude-code setup-token` |
| **GitHub** › Secrets › Actions | `AGENT_GITHUB_TOKEN` | `github_pat_…` | github.com › Fine-grained tokens |
| **GitHub** › Secrets › Actions | `SUPABASE_URL` | `https://viaeglmpkyfaxjodepgi.supabase.co` | fixe |
| **GitHub** › Secrets › Actions | `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_…` | Supabase › Project Settings › API Keys |
| **Supabase** › Edge Functions › Secrets | `AGENT_GITHUB_TOKEN` | le même `github_pat_…` | idem |
| **Supabase** › Edge Functions › Secrets | `AGENT_WORKFLOW_REPO` | `Hassyunity/porttfolio-2026` | fixe |
| **Supabase** › Edge Functions › Secrets | `AGENT_WORKFLOW_REF` | `Production` | fixe |
| **Supabase** › Edge Functions › Secrets | `AGENT_ALLOWED_REPOS` | `Hassyunity/porttfolio-2026` | liste blanche |
| **Netlify** › Environment variables | `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | URL + `sb_publishable_…` | déjà en place |
| **Netlify** › Environment variables | `VITE_AGENT_FUNCTION` | `super-handler` | nom réel de la fonction |
| **`.env.local`** (PC, pour l'APK) | mêmes `VITE_…` que Netlify + `VITE_SITE_URL` | voir [4.2](#42-configuration-envlocal) | — |

> Le jeton Claude va **uniquement** dans GitHub. Ni dans Supabase, ni dans `.env.local`, ni dans l'app.

---

## 8. Dépannage : problèmes déjà rencontrés

### 8.1 « Invalid API key » dans l'app alors que le site marche

- **Cause :** `.env.local` contenait une ancienne clé publishable, refusée par Supabase. Le site en ligne utilise celle de Netlify, qui était la bonne.
- **Diagnostic :**
  ```bash
  set -a; . ./.env.local; set +a
  curl -s -H "apikey: $VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_URL/auth/v1/settings"
  ```
  Un `401 Invalid API key` signifie que la clé est mauvaise.
- **Solution :** recopier dans `.env.local` la clé de Netlify (ou de Supabase › API Keys), puis `npm run android:apk`.

### 8.2 « Les tables de l'agent n'existent pas »

- **Cause :** `supabase/agent.sql` n'avait pas encore été exécuté (erreur `PGRST205`).
- **Solution :** [étape 1](#étape-1--créer-les-tables-dans-supabase). Si le SQL a déjà été lancé, faire `notify pgrst, 'reload schema';` et vérifier qu'on est dans le bon projet.

### 8.3 « Où est l'Edge Function ? »

- **Piège n°1 :** le tableau de bord ouvert était celui de **Render** (menus Blueprints, Environment Groups…), pas celui de Supabase.
- **Piège n°2 :** l'organisation Supabase affiche un projet nommé « altea-flow ». Toujours vérifier que l'adresse contient **`viaeglmpkyfaxjodepgi`**.
- **Lien direct :** https://supabase.com/dashboard/project/viaeglmpkyfaxjodepgi/functions
- **Piège n°3 :** l'éditeur propose un code d'exemple (`withSupabase`, « Hello name ») : il faut le **remplacer entièrement**.

### 8.4 « Impossible de joindre l'Edge Function » alors qu'elle est déployée

- **Cause :** la fonction a été déployée sous un nom généré automatiquement, **`super-handler`**, alors que l'app appelait `agent-dispatch`. Supabase répondait `NOT_FOUND`.
- **Solution appliquée :** le nom est maintenant réglable par la variable `VITE_AGENT_FUNCTION` (`.env.local` pour l'APK, Netlify pour le web). L'app affiche désormais le nom qu'elle cherche dans le message d'erreur.
- **Pour vérifier le nom réel :** Supabase › Edge Functions : le nom figure dans la liste et dans l'URL `…/functions/v1/<nom>`.

### 8.5 L'exécution passe en « Échec »

Ouvrir **Logs GitHub** depuis l'app, puis regarder l'étape en rouge :

| Étape en échec | Cause probable | Solution |
|---|---|---|
| Message affiché dans l'app « GitHub a refusé la demande (401/403/404) » | Token GitHub invalide, expiré ou sans droit **Actions** ; workflow absent de `Production` | Vérifier le token et le secret Supabase `AGENT_GITHUB_TOKEN` ; vérifier l'onglet Actions |
| « Secret … manquant dans la fonction » | Secret Supabase oublié | Ajouter le secret ([étape 5](#étape-5--déployer-ledge-function)) |
| « Lire la tâche » | `SUPABASE_URL` ou `SUPABASE_SERVICE_ROLE_KEY` faux côté GitHub | Corriger les secrets GitHub |
| « Cloner le dépôt cible » | Token sans accès à ce dépôt, ou branche de départ inexistante | Repository access du token ; corriger la branche du script |
| « Travail de l'agent » | Jeton Claude absent ou expiré, **limite du forfait atteinte**, consigne trop vaste (120 tours) | Refaire `setup-token` ; attendre la réinitialisation ; découper la consigne |
| « Pousser la branche et ouvrir la Pull Request » | Token sans **Contents** ou **Pull requests** en écriture | Ajouter ces permissions au token |
| « Le dépôt … n'est pas dans la liste autorisée » | Dépôt absent de `AGENT_ALLOWED_REPOS` | L'ajouter au secret Supabase |

### 8.6 Rien ne se passe, l'exécution reste « En file »

- La machine GitHub démarre en général en moins d'une minute.
- Si l'exécution reste en file : vérifier l'onglet **Actions** du dépôt (Actions désactivées ? quota de minutes GitHub épuisé ?).
- Si besoin, bouton **Arrêter**, puis relancer.

### 8.7 L'APK ne s'installe pas par-dessus l'ancienne version

- `versionCode` n'a pas été augmenté, ou l'APK a été signé avec une autre clé (keystore perdu ou régénéré).
- Avec une autre clé, il faut désinstaller l'ancienne app avant d'installer la nouvelle (les brouillons locaux de l'app sont alors perdus).

### 8.8 Build de l'APK : « JDK introuvable »

Le JDK est dans `~/jdk21`, pas dans le PATH. Lancer toujours via `npm run android:apk`, ou exporter `JAVA_HOME=$HOME/jdk21`.

---

## 9. Sécurité

- **Le token GitHub n'est jamais dans l'app** : seule l'Edge Function le détient, et elle refuse tout appelant qui n'est pas admin (`is_blog_admin()`).
- **Tables protégées par RLS** : seuls les admins lisent et écrivent ; l'accès anonyme est révoqué.
- **Isolation de l'agent** : pendant l'étape « Travail de l'agent », seul `CLAUDE_CODE_OAUTH_TOKEN` est exposé. Ni le token GitHub, ni la clé Supabase. Les dépôts sont clonés **sans identifiants** sur le disque (`persist-credentials: false`). Le push et la PR se font dans une étape séparée.
- **Liste blanche** des dépôts : `AGENT_ALLOWED_REPOS`.
- **Validation humaine** : l'agent n'ouvre que des Pull Requests et ne fusionne jamais.
- **Abonnement seulement** : le workflow ne lit pas `ANTHROPIC_API_KEY`, donc aucune dépense à l'usage possible.
- **App Android** : sauvegarde Android désactivée, inspection de la WebView désactivée en release.
- **Si un secret fuit** : le révoquer immédiatement à la source (GitHub › tokens, `claude setup-token` pour en générer un nouveau, Supabase › API Keys), puis mettre à jour les secrets GitHub et Supabase.

---

## 10. Maintenance et échéances

| Élément | Échéance | Action |
|---|---|---|
| Token GitHub `agent-ia` | selon l'expiration choisie (ex. 90 jours) | En générer un nouveau ; le mettre à jour dans **GitHub Secrets** et **Supabase Secrets** |
| Jeton Claude `CLAUDE_CODE_OAUTH_TOKEN` | ≈ 1 an | `npx @anthropic-ai/claude-code setup-token`, puis mettre à jour le secret GitHub |
| Keystore Android | jamais (validité de 10 000 jours) | **Sauvegarder** `android/studio-blog-release.jks` + `android/keystore.properties` hors du PC |
| Projet Supabase gratuit | après une période d'inactivité | Le réactiver depuis le tableau de bord s'il est mis en pause |
| Code de l'Edge Function | à chaque modification de `supabase/functions/agent-dispatch/index.ts` | Redéployer (mêmes étapes, même nom `super-handler`) |
| Workflow | à chaque modification de `.github/` | Pousser sur `Production` |
| App Android | à chaque modification de l'admin | Augmenter `versionCode`, puis `npm run android:apk` |
