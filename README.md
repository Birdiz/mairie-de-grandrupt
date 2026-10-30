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
CONTACT_EMAIL_FROM=noreply@village-de-grandrupt.fr

# Payload CMS
PAYLOAD_SECRET=<chaîne_aléatoire_longue>   # openssl rand -base64 32
DATABASE_URI=file:./data/payload.db          # SQLite (chemin relatif au dossier de l'app)

# Domaine (production ; laisser vide en local)
SITE_DOMAIN=www.village-de-grandrupt.fr      # adresse canonique servie par Caddy
SITE_DOMAIN_APEX=village-de-grandrupt.fr     # domaine nu, redirigé en 301 vers le www
SITE_URL=https://www.village-de-grandrupt.fr # URL absolue (sitemap.xml, robots.txt)
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

## Intégration continue

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) tourne sur chaque PR et chaque push sur `main`, en trois jobs parallèles :

- **Lint, types, tests, build** — l'équivalent de `make ci` ;
- **E2E Chromium** — Playwright sur le serveur de production standalone, avec une base neuve (les migrations Payload sont donc rejouées) ;
- **Build Docker** — vérifie que l'image de prod se construit, sans la publier.

En local, `make e2e` lance les trois navigateurs sur le serveur de dev. Dependabot ([`.github/dependabot.yml`](.github/dependabot.yml)) ouvre chaque lundi des PR groupées pour npm et les actions GitHub.

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

**Production (auto-hébergée) :**

Le site est conçu pour être **auto-hébergé** (VPS, idéalement en Europe pour le RGPD) — données et médias restent sur votre infra. `docker-compose.prod.yml` démarre deux conteneurs :

- `web` — l'app Next.js + Payload (interne au réseau Docker),
- `caddy` — reverse proxy qui gère le **HTTPS automatiquement** (Let's Encrypt) et proxifie vers `web`.

```bash
# 1. Renseigner les variables (dont SITE_DOMAIN, SITE_DOMAIN_APEX, SITE_URL + PAYLOAD_SECRET)
cp .env.example .env.local && nano .env.local
# 2. Construire + démarrer (web + caddy)
make docker-prod
# 3. Ouvrir https://<votre-domaine>/admin et créer le premier compte (auto-admin)
```

#### DNS à configurer chez le registrar

Deux enregistrements, **tous les deux vers l'IP publique du serveur** :

| Type | Nom   | Valeur        |
| ---- | ----- | ------------- |
| `A`  | `@`   | `<IP_du_VPS>` |
| `A`  | `www` | `<IP_du_VPS>` |

Ajouter les mêmes en `AAAA` si le serveur a une IPv6. Caddy sert `www.village-de-grandrupt.fr`
(`SITE_DOMAIN`) et redirige `village-de-grandrupt.fr` (`SITE_DOMAIN_APEX`) dessus en 301.

> Le DNS doit résoudre **avant** le premier démarrage : Caddy demande les certificats Let's Encrypt au lancement, et la validation échoue si le domaine ne pointe pas encore vers le serveur. Sans `SITE_DOMAIN`, Caddy sert `https://localhost` avec un certificat auto-signé (utile pour un test local).

### Checklist de mise en production

1. **Variables d'environnement** (`.env.local`) : `RESEND_API_KEY`, `PAYLOAD_SECRET` (≥ 32 car. — refusé au démarrage sinon), `SITE_DOMAIN`, `SITE_DOMAIN_APEX`, `SITE_URL`.
2. **Nom de domaine** : le déposer **au nom de la commune**, pas à celui du prestataire ou d'un élu à titre personnel. L'AFNIC protège les noms de collectivités territoriales (art. L45-2 du CPCE), et un dépôt par un tiers peut être contesté — sans compter le risque de perdre le domaine au moment de passer la main.
3. **Domaine vérifié chez Resend** : ajouter les enregistrements DNS fournis par Resend (`TXT` DKIM + SPF, éventuellement `MX` pour le retour) sur `village-de-grandrupt.fr`. Sans cette vérification, les messages du formulaire de contact envoyés depuis `CONTACT_EMAIL_FROM` sont rejetés ou classés en spam.
4. **Données persistantes** : quatre volumes nommés (`mairie-data` = base SQLite, `mairie-media` = uploads, `caddy_data`/`caddy_config` = certificats). Ils survivent aux redéploiements.
5. **Premier admin** : après le premier démarrage, créer le compte sur `/admin` (auto-promu administrateur).
6. **Schéma de base** : en production, Payload désactive le `push` et exécute les **migrations** au démarrage (versionnées dans `src/migrations/`, embarquées via `prodMigrations`) — automatique. En dev, le schéma se synchronise via `push`.
7. **Sauvegardes** : `./scripts/backup.sh [dossier]` archive `mairie-data` + `mairie-media`. Exemple cron quotidien :
   ```cron
   0 3 * * * cd /chemin/app && ./scripts/backup.sh /var/backups/grandrupt >> /var/log/grandrupt-backup.log 2>&1
   ```

**Vous avez déjà un reverse proxy** (Nginx/Traefik) ? Retirez le service `caddy` de `docker-compose.prod.yml`, exposez `web` sur `127.0.0.1:3000` et pointez votre proxy dessus.

> Le **premier build d'image est long** (réinstallation complète des dépendances + compilation de binaires natifs `sharp`/SQLite sur Alpine). Les builds suivants sont rapides grâce au cache de layers Docker tant que `package.json` ne change pas. Vérifier que le démon Docker tourne avant de lancer la commande.

> ⚠️ **Vercel (et autres plateformes serverless) ne sont pas supportés** avec cette configuration : la base **SQLite** et les **médias** sont stockés sur le système de fichiers local, qui n'est ni persistant ni accessible en écriture sur Vercel (erreur `SQLITE_CANTOPEN`). Y déployer nécessiterait une base hébergée (ex. Turso/libsql, compatible avec nos migrations) **et** un stockage objet (Vercel Blob / S3) — non retenu ici pour des raisons de souveraineté des données (RGPD).

### Faire évoluer le schéma (nouvelle migration)

Après toute modification d'une collection (champ ajouté, etc.), générer une nouvelle migration et la committer dans `src/migrations/`, puis la référencer dans `prodMigrations` (`src/payload.config.ts`).

> ⚠️ La CLI Payload (`payload migrate:create`) ne fonctionne pas sous **Node 25**. Générer les migrations sous **Node 22** (`npx payload migrate:create <nom>`), ou via le runtime Next si besoin. La migration initiale est déjà en place.

## Structure du projet

```
src/
├── app/
│   ├── [locale]/        # Pages i18n (layout, pages)
│   │   ├── (chargement)/        # Pages avec écran de chargement (loading.tsx)
│   │   └── actualites/[slug]/   # Article : 404 vérifiée avant le chargement
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
