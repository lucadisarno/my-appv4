# ============================================
# STAGE 1: BUILDER - Installa dipendenze e builda
# ============================================
FROM node:22-alpine AS builder

# Installa pnpm
RUN npm install -g pnpm@10.32.1

WORKDIR /app

# Copia SOLO i file necessari per installare
# (per sfruttare il caching di Docker)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copia la struttura del monorepo
COPY apps ./apps
COPY packages ./packages

# Installa tutte le dipendenze
# --frozen-lockfile = usa esattamente le versioni in pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Builda SOLO l'API
RUN pnpm turbo build --filter=@my-app/api

# Verifica che il build è andato a buon fine
RUN ls -la apps/api/dist/


# ============================================
# STAGE 2: RUNTIME - Solo quello che serve
# ============================================
FROM node:22-alpine

RUN npm install -g pnpm@10.32.1

WORKDIR /app

# Copia il dist compilato dal builder
COPY --from=builder /app/apps/api/dist ./dist

# Copia il package.json dell'api
COPY apps/api/package.json ./

# Installa SOLO le dipendenze di produzione
# (senza typescript, tsx, dev tools, ecc.)
RUN pnpm install --prod --frozen-lockfile

# La porta che l'API usa (vedi nel tuo index.ts: port || 3001)
EXPOSE 3000 3001

# Comando di avvio
CMD ["node", "dist/index.js"]
