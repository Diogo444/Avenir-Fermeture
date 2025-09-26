# ---- Angular frontend build (Nx) ----
FROM node:20-alpine AS builder

WORKDIR /workspace

# Install workspace deps (includes dev deps for Angular build)
COPY package*.json ./
RUN npm ci

# Copy minimal files needed for Nx/Angular build
COPY nx.json ./
COPY tsconfig.base.json ./
COPY apps ./apps

# Build Angular app in production mode
RUN npx nx build avenirFermeture --configuration=production

# ---- Nginx runtime image ----
FROM nginx:1.27-alpine AS runner

# Nginx config with SPA fallback and /api proxy to backend service
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular assets
COPY --from=builder /workspace/dist/apps/avenirFermeture/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

