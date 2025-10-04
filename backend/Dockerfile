# ---- Build backend ----
FROM node:20-alpine AS builder

WORKDIR /workspace

# Installer les deps racine
COPY package*.json ./
RUN npm ci

# Copier le workspace complet (protégé par .dockerignore)
COPY . .

# Build webpack via Nx (sortie: dist/backend) et générer lock pruné
RUN npx nx build backend -c production

# ---- Runtime ----
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copier le package.json généré par Nx
COPY --from=builder /workspace/dist/backend/package*.json ./

# Installer uniquement les deps prod prunées
RUN npm install --omit=dev --no-audit --no-fund

# Copier le code compilé backend
COPY --from=builder /workspace/dist/backend ./

# Hygiène: utilisateur non-root
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup \
  && chown -R nodeuser:nodegroup /app
USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api > /dev/null 2>&1 || exit 1

CMD ["node", "main.js"]
