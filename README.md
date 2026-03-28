# Mairie de Grandrupt — Site officiel

Site web de la commune de Grandrupt, construit avec Next.js 16, Tailwind CSS 4 et next-intl. Accessible, multilingue (fr/de/en), dockerisé.

## Stack technique

- **Next.js 16.2.1** — App Router, Turbopack
- **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS 4** + shadcn/ui (base-nova)
- **next-intl 4** — i18n, préfixe `as-needed` (fr par défaut)
- **React Hook Form + Zod** — validation des formulaires
- **Resend** — envoi d'e-mails (formulaire de contact)
- **Docker** — multi-stage Dockerfile, compose dev + prod

## Prérequis

- Node.js 22+
- npm 10+
- Docker & Docker Compose (optionnel)

## Installation

```bash
npm install
```

Créer un fichier `.env.local` à la racine :

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL_TO=communedegrandrupt@orange.fr
CONTACT_EMAIL_FROM=noreply@grandrupt.fr
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

## Docker

**Développement :**

```bash
make docker-dev
# → http://localhost:3000
```

**Production :**

```bash
make docker-prod
# → http://localhost:3000
```

> L'env file `.env.local` est chargé automatiquement par Docker Compose.

## Structure du projet

```
src/
├── app/
│   ├── [locale]/        # Pages i18n (layout, pages)
│   ├── api/             # API routes (contact, etc.)
│   └── layout.tsx       # Root layout (passthrough)
├── components/
│   ├── layout/          # Header, Footer, SkipLink
│   ├── sections/        # Sections de page
│   └── ui/              # Composants shadcn/ui
├── content/             # Contenu statique (actualités, etc.)
├── i18n/
│   ├── messages/        # Traductions fr / de / en
│   ├── routing.ts       # Configuration next-intl
│   └── request.ts
└── lib/                 # Utilitaires (env, resend, validations…)
tests/
├── unit/                # Vitest + React Testing Library
└── e2e/                 # Playwright
```

## Qualité & accessibilité

- ESLint 9 (flat config) avec jsx-a11y — règles d'accessibilité
- Prettier — formatage uniforme
- Husky pre-commit — lint-staged sur les fichiers modifiés
- Cible : RGAA / WCAG 2.1 AA (site à destination d'un public varié, dont des personnes âgées)
