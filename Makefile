.PHONY: dev prod build test test-watch e2e e2e-ui lint lint-fix format type-check qa ci install clean

## ── Development ───────────────────────────────────────────────────────────────

dev: ## Start dev server (hot reload)
	npm run dev

prod: ## Start production container
	docker compose -f docker-compose.prod.yml up

build: ## Build Next.js for production
	npm run build

## ── Testing ───────────────────────────────────────────────────────────────────

test: ## Run Vitest unit tests
	npm run test

test-watch: ## Run Vitest in watch mode
	npm run test:watch

e2e: ## Run Playwright E2E tests
	npm run e2e

e2e-ui: ## Open Playwright UI
	npm run e2e:ui

## ── Code quality ──────────────────────────────────────────────────────────────

lint: ## Run ESLint + Prettier check
	npm run lint && npm run format:check

lint-fix: ## Auto-fix ESLint issues
	npm run lint:fix

format: ## Format all files with Prettier
	npm run format

type-check: ## Run TypeScript type checker
	npm run type-check

qa: lint type-check test ## Full quality gate (lint + types + tests)

ci: lint type-check test build ## Full CI check (lint + types + tests + build)

## ── Docker ────────────────────────────────────────────────────────────────────

docker-dev: ## Start dev environment in Docker
	docker compose up

docker-prod: ## Start production environment in Docker
	docker compose -f docker-compose.prod.yml up --build

docker-down: ## Stop all Docker containers
	docker compose down

## ── Setup ─────────────────────────────────────────────────────────────────────

install: ## Install npm dependencies
	npm install

clean: ## Remove .next build directory
	rm -rf .next

## ── Help ──────────────────────────────────────────────────────────────────────

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
