# ---- Angular build (Nx) ----
FROM node:20-alpine AS builder

WORKDIR /workspace

# 1) Install deps
COPY package*.json ./
RUN npm ci

# 2) Copier le workspace (protégé par .dockerignore)
COPY . .

# 3) Build Angular en prod (sortie: dist/apps/avenirFermeture/browser)
RUN npx nx build avenirFermeture -c production

# ---- Nginx runtime ----
FROM nginx:1.25-alpine AS runner

# Nginx conf: SPA + proxy /api -> backend
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Assets Angular
COPY --from=builder /workspace/dist/apps/avenirFermeture/browser /usr/share/nginx/html

EXPOSE 80

# Healthcheck HTTP simple via wget (alpine en a un)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null 2>&1 || exit 1
