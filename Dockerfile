# ============================================
# STAGE 1: BUILDER - Installa dipendenze e builda
# ============================================
FROM node:22-alpine AS builder

# Installa pnpm (il package manager che usi)
RUN npm install -g pnpm@10.32.1

# Setta la working directory (cartella di lavoro)
WORKDIR /app

# Copia solo i file di configurazione della root
# Questo è importante per sfruttare la cache di Docker
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copia i file di tutte le app dentro apps/
COPY apps ./apps
COPY packages ./packages 2>/dev/null || true

# Installa tutte le dipendenze
# --frozen-lockfile = usa esattamente le versioni in pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Builda SOLO l'API usando Turbo
# --force = forza il rebuild anche se è in cache
RUN pnpm turbo build --filter=@my-app/api --force


# ============================================
# STAGE 2: RUNTIME - Esecuzione (più piccolo)
# ============================================
FROM node:22-alpine

# Installa pnpm anche qui (per le dipendenze runtime)
RUN npm install -g pnpm@10.32.1

# Working directory
WORKDIR /app

# Copia dal builder solo quello che serve per eseguire
# Copia la cartella dist buildato
COPY --from=builder /app/apps/api/dist ./dist

# Copia il package.json dell'api (serve per le dipendenze runtime)
COPY apps/api/package.json ./

# Installa SOLO le dipendenze di produzione
# --prod = no devDependencies (typescript, tsx, ecc. non servono in produzione)
RUN pnpm install --prod --frozen-lockfile

# Espone la porta (modifica se necessario)
EXPOSE 3000

# Comando per eseguire l'app
CMD ["node", "dist/index.js"]
