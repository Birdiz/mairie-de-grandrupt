# Grandrupt — Site officiel

Site web de la commune de Grandrupt, construit avec Next.js 16, Tailwind CSS 4 et next-intl. Accessible, multilingue (fr/de/en), dockerisé. Les actualités sont gérées depuis un back-office (Payload CMS) avec gestion des rôles.

## Stack technique

- **Next.js 16.2.7** — App Router, Turbopack
- **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS 4** + shadcn/ui (base-nova)
- **next-intl 4** — i18n, préfixe `as-needed` (fr par défaut)
- **Payload CMS 3** — back-office `/admin`, rôles, base **SQLite**, éditeur rich-text
- **React Hook Form + Zod** — validation des formulaires
- **Resend** — envoi d'e-mails (formulaire de contact)
- **Docker** — multi-stage Dockerfile, compose dev + prod

## Prérequis

- **Node.js 22** (recommandé). La CLI Payload (`payload generate:types`, migrations) ne fonctionne pas sous Node 25 ; l'application, elle, tourne sur toute version supportée par Next.
- npm 10+
- Docker & Docker Compose (optionnel)

## Installation

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
```

Variables d'environnement (voir `.env.example`) :

```env
# Resend (formulaire de contact)
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=communedegrandrupt@orange.fr
CONTACT_EMAIL_FROM=noreply@grandrupt.fr

# Payload CMS
PAYLOAD_SECRET=<chaîne_aléatoire_longue>   # openssl rand -base64 32
DATABASE_URI=file:./data/payload.db        # SQLite (chemin relatif au dossier de l'app)
```

## Commandes

```bash
make dev          # Serveur de développement (hot reload)
make build        # Build Next.js production
make prod         # Démarrer le conteneur de production

make test         # Tests unitaires (Vitest)
make test-watch   # Vitest en mode watch
make e2e          # Tests E2E (Playwright)
make e2e-ui       # Playwright UI

make lint         # ESLint + Prettier (vérification)
make format       # Formater avec Prettier
make type-check   # TypeScript
make qa           # lint + types + tests
make ci           # lint + types + tests + build

make docker-dev   # Environnement dev en Docker
make docker-prod  # Environnement prod en Docker
make install      # Installer les dépendances
make clean        # Supprimer .next/
```

## Administration des actualités (back-office)

Les actualités sont gérées depuis le back-office Payload, accessible sur **`/admin`**.

- **Premier lancement** : ouvrir `http://localhost:3000/admin` et créer le premier compte via l'écran « create first user ». Ce compte devient automatiquement **administrateur**.
- **Rôles** (champ sur chaque utilisateur) :
  - **Rédacteur** — crée et modifie des brouillons, **ne peut pas publier**.
  - **Publicateur** — tout ce que fait un rédacteur, **+ publier / dépublier** et supprimer.
  - **Administrateur** — tout, **+ gestion des comptes et des rôles**.
- Un article n'apparaît sur le site public **que lorsqu'il est publié**. Les brouillons restent privés.
- L'éditeur est en **rich-text** (gras, titres, listes, liens…) ; chaque image téléversée demande un **texte alternatif** (accessibilité).
- Après publication/modification, les pages publiques (`/actualites`, l'accueil, la page article) sont **revalidées automatiquement** — pas besoin de rebuild.

> La barrière de publication est appliquée côté serveur (admin **et** API) : un rédacteur ne peut pas publier, même via l'API.

## Docker & déploiement en production

**Développement :**

```bash
make docker-dev   # → http://localhost:3000
```

**Production :**

```bash
make docker-prod  # build l'image puis démarre le conteneur → http://localhost:3000
```

> L'env file `.env.local` est chargé automatiquement par Docker Compose.

### Checklist de mise en production

1. **Variables d'environnement** : renseigner `.env.local` (clé Resend + `PAYLOAD_SECRET` long et secret + `DATABASE_URI`).
2. **Données persistantes** : `docker-compose.prod.yml` monte deux volumes nommés :
   - `mairie-data` → `/app/data` (base SQLite),
   - `mairie-media` → `/app/media` (images téléversées).
     Ils survivent aux redéploiements ; **les inclure dans la stratégie de sauvegarde** (une sauvegarde = copier le fichier `payload.db` + le dossier media).
3. **Premier admin** : après le premier démarrage, créer le compte admin sur `/admin` (voir ci-dessus).
4. **Schéma de base** : en production, Payload désactive le `push` et exécute les **migrations** au démarrage. Elles sont versionnées dans `src/migrations/` et embarquées dans la config (`prodMigrations`) — elles s'appliquent automatiquement, aucune commande manuelle requise. En développement, le schéma est synchronisé automatiquement (`push`).
5. **Reverse proxy** : placer le conteneur derrière un proxy HTTPS (Nginx, Caddy, Traefik…) ; le serveur écoute sur le port `3000`.

> Le **premier build d'image est long** (réinstallation complète des dépendances + compilation de binaires natifs `sharp`/SQLite sur Alpine). Les builds suivants sont rapides grâce au cache de layers Docker tant que `package.json` ne change pas. Vérifier que le démon Docker tourne avant de lancer la commande.

### Faire évoluer le schéma (nouvelle migration)

Après toute modification d'une collection (champ ajouté, etc.), générer une nouvelle migration et la committer dans `src/migrations/`, puis la référencer dans `prodMigrations` (`src/payload.config.ts`).

> ⚠️ La CLI Payload (`payload migrate:create`) ne fonctionne pas sous **Node 25**. Générer les migrations sous **Node 22** (`npx payload migrate:create <nom>`), ou via le runtime Next si besoin. La migration initiale est déjà en place.

## Structure du projet

```
src/
├── app/
│   ├── [locale]/        # Pages i18n (layout, pages)
│   ├── (payload)/       # Back-office Payload (/admin) + API REST/GraphQL
│   ├── api/             # API routes maison (contact, etc.)
│   └── layout.tsx       # Root layout (passthrough)
├── access/              # Règles de permissions Payload (rôles)
├── collections/         # Collections Payload (Actualites, Users, Media)
├── hooks/               # Hooks Payload (barrière de publication, slug, revalidation)
├── payload.config.ts    # Configuration Payload (SQLite, éditeur, collections)
├── components/
│   ├── layout/          # Header, Footer, SkipLink
│   ├── sections/        # Sections de page
│   └── ui/              # Composants shadcn/ui
├── content/             # Contenu markdown statique (entreprises)
├── i18n/
│   ├── messages/        # Traductions fr / de / en
│   ├── routing.ts       # Configuration next-intl
│   └── request.ts
└── lib/                 # Utilitaires (env, resend, validations, actualites, dates…)
tests/
├── unit/                # Vitest + React Testing Library
└── e2e/                 # Playwright
data/   media/           # Données runtime (SQLite + uploads) — non versionnées
```

## Qualité & accessibilité

- ESLint 9 (flat config) avec jsx-a11y — règles d'accessibilité
- Prettier — formatage uniforme
- Husky pre-commit — lint-staged sur les fichiers modifiés
- Cible : RGAA / WCAG 2.1 AA (site à destination d'un public varié, dont des personnes âgées)
