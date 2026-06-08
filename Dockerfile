# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ─── Stage 2: builder ─────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build-time placeholders so env validation (src/lib/env.ts) and Payload config
# load during `next build`. Real values are injected at runtime via env_file.
ENV RESEND_API_KEY=build-placeholder
ENV PAYLOAD_SECRET=build-placeholder
ENV DATABASE_URI=file:./data/payload.db

RUN npm run build

# ─── Stage 3: runner (production) ─────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Persistent data dirs (SQLite DB + uploaded media), owned by the runtime user.
# Mounted as volumes in docker-compose.prod.yml; the named volumes inherit this
# ownership on first creation so the app can write to them.
RUN mkdir -p /app/data /app/media && chown -R nextjs:nodejs /app/data /app/media

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
