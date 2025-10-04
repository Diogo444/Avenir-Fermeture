# ---- Build frontend (Angular) ----
FROM node:20-alpine AS builder

WORKDIR /workspace

# Install root dependencies for Nx workspace
COPY package*.json ./
RUN npm ci

# Copy the entire workspace (honors .dockerignore)
COPY . .

# Build the Angular app with Nx (output in dist/apps/avenirFermeture/browser)
RUN npx nx build avenirFermeture -c production

# ---- Nginx runtime ----
FROM nginx:alpine AS runner

# Replace default server with our SPA + API proxy
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular assets to Nginx html directory
COPY --from=builder /workspace/dist/apps/avenirFermeture/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ > /dev/null 2>&1 || exit 1

