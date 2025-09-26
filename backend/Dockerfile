# ---- NestJS backend build (Nx + Webpack) ----
FROM node:20-alpine AS builder

WORKDIR /workspace

# Install workspace deps (includes dev deps for build tooling)
COPY package*.json ./
RUN npm ci

# Copy minimal files for backend build
COPY nx.json ./
COPY tsconfig.base.json ./
COPY backend ./backend

# Build backend (outputs to dist/backend and generates minimal package.json)
RUN cd backend && npx webpack-cli build --node-env=production

# ---- Runtime image ----
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy compiled backend bundle and generated package files
COPY --from=builder /workspace/dist/backend ./

# Install only production dependencies for the generated package.json
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev --no-audit --no-fund; fi

EXPOSE 3000

CMD ["node", "main.js"]

