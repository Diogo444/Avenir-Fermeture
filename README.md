# AvenirFermeture — Guide complet (à jour)

Monorepo Nx regroupant une application Angular (front) et une API NestJS (back) pour la gestion d'une entreprise de fermeture. Ce guide couvre l’installation, le développement, les commandes utiles, l’architecture, l’API et le déploiement Docker.

## Sommaire
- Prérequis
- Démarrage rapide (Docker)
- Développement local (sans Docker)
- Commandes Nx et npm
- Architecture du monorepo
- Frontend Angular
- Backend NestJS et base de données
- API REST
- Fichiers d’environnement
- Build, Docker et déploiement
- Tests et vérification
- Dépannage
- Pistes d’évolution

## Prérequis
- Node.js 20.x (npm 10 inclus)
- Docker Desktop (optionnel mais recommandé)
- MySQL 8.x si vous ne passez pas par Docker
- Git et un terminal avec `npx`

## Démarrage rapide (Docker)
1. Construire et lancer l’ensemble (BDD + API + Front) depuis la racine :
   ```bash
   docker compose up --build
   ```
2. Front Angular: `http://localhost:8080`
3. API NestJS via Nginx: `http://localhost:8080/api` (ou directement: `http://localhost:3000/api`)

Détails Compose :
- `db` (MySQL 8) avec volume `mysql_data` et identifiants définis dans `docker-compose.yml`
- `backend` construit via `backend/Dockerfile` (TypeORM configuré par variables d’environnement)
- `frontend` construit via `apps/avenirFermeture/Dockerfile` (Nginx sert le build Angular et proxifie `/api`)
- Nettoyer la stack: `docker compose down -v`

## Développement local (sans Docker)
1. Installer les dépendances workspace :
   ```bash
   npm ci
   ```
2. Préparer MySQL :
   - Créer une base (ex : `avenir_fermeture`)
   - Créer un fichier `backend/.env` (exemple ci-dessous, voir section “Fichiers d’environnement”)
3. Lancer l’API NestJS (dev):
   ```bash
   npx nx serve backend
   ```
   - Écoute: `http://localhost:3000/api`
   - Rebuild/serve gérés via Webpack
4. Lancer l’app Angular (dev):
   ```bash
   npx nx serve avenirFermeture
   ```
   - Écoute: `http://localhost:4200`
   - Le front pointe vers `http://localhost:3000/api` (voir `apps/avenirFermeture/src/environments/environment.development.ts`)
5. Option: lancer les deux en parallèle :
   ```bash
   npx nx run-many -t serve --projects=backend,avenirFermeture
   ```
6. Arrêt: `Ctrl + C` (chaque terminal)

## Commandes Nx et npm
- `npx nx serve avenirFermeture` — serveur Angular (dev)
- `npx nx build avenirFermeture` — build prod (`dist/apps/avenirFermeture/browser`)
- `npx nx serve backend` — serveur NestJS (dev)
- `npx nx build backend` — build Webpack (`dist/backend`)
- `npx nx run backend:serve --configuration=production` — sert le bundle compilé
- `npx nx run avenirFermeture:serve-static` — sert le build via le file server Nx
- `npx nx graph` — graphe des dépendances
- `npx nx lint avenirFermeture` — lint du front (ESLint)

Alias npm (générateurs Nx):
- `npm run ngc -- chemin/nom` — composant Angular standalone
- `npm run ngs -- chemin/nom` — service Angular
- `npm run ngm -- chemin/nom` — module Angular (si nécessaire)
- `npm run ngp -- chemin/nom` — pipe Angular
- `npm run nc -- nom` — controller Nest
- `npm run ns -- nom` — service Nest
- `npm run nm -- nom` — module Nest
- `npm run nr -- nom` — resource Nest (module + controller + service)
- `npm run g -- <schematics>` — passe-plat vers `nx g`

Backend (post-build utiles):
- `backend:prune` — génère lockfile + copie des deps prod dans `dist/backend`
- `backend:prune-lockfile`, `backend:copy-workspace-modules` — sous-tâches appelées par `prune`

## Architecture du monorepo
```
.
|- apps/
|  |- avenirFermeture/          # Application Angular 20 (standalone)
|- backend/                     # API NestJS 11 + TypeORM
|- backend-e2e/                 # (placeholder) base e2e backend
|- docker/                      # Config Nginx pour l’image frontend
|- dist/                        # Sorties de build Nx
|- nx.json, package.json, tsconfig.base.json
`- ...
```

Points d’intérêt :
- `apps/avenirFermeture/src/app` — composants standalone, routes (`app.routes.ts`), config (`app.config.ts`), services (`services/api/api.ts`), modèles
- `backend/src/app` — modules Nest (Clients, Produits, Commercial, Affaire, Dashboard), DTO, entités TypeORM
- `backend/request.http` — requêtes prêtes à l’emploi pour tester l’API

## Frontend Angular
- Angular 20, composants standalone, Angular Material, Bootstrap
- Config globale `app.config.ts`: `provideRouter(appRoutes)`, `provideHttpClient()`, `provideAnimations()`
- Composant racine `App` (`src/app/app.ts`) + `Navbar` et `<router-outlet>`
- Service API (`src/app/services/api/api.ts`) pointant vers `environment.apiUrl`

Routes principales (`src/app/app.routes.ts`) :
- `/` → `Dashboard`
- `/clients` → `Clients`
- `/commercial` → `Commercial`
- `/comptabilite` → `Comptabilite`
- `/dev-ajout-produit` → `AjoutProduit`
- `/cree-client` → `AddClient`
- `/one-client/:code-client` → `OneClientComponent` (implémenté)
- `/test` → `Test`

## Backend NestJS et base de données
- NestJS 11, TypeORM (MySQL), build Webpack via Nx
- `main.ts` : CORS activé (`CORS_ORIGIN`), préfixe global `/api`, port par défaut `3000`
- `AppModule` : `TypeOrmModule.forRoot` via variables d’env (MySQL), modules importés : `Clients`, `Produits`, `Commercial`, `Affaire`, `Dashboard`
- `synchronize` actif par défaut (désactiver en prod si vous utilisez des migrations)

Schéma TypeORM (résumé) :
- `clients` : `id`, `code_client` (unique) + infos contact/adresse + champs financiers/livraison + timestamps
- `produits` : `id`, `nom`
- `commercials` : `id`, `firstName`, `lastName`

## API REST
Préfixe global : `/api`

Clients (`backend/src/app/clients`)
- `GET /api/clients` — liste des clients
- `GET /api/clients/:code_client` — détail par code client (string)
- `POST /api/clients` — création d’un client
- `PATCH /api/clients/:id` — mise à jour par id (numérique)
- `DELETE /api/clients/:id` — suppression par id

Produits (`backend/src/app/produits`)
- `GET /api/produits` — liste des produits
- `GET /api/produits/:id` — détail d’un produit
- `POST /api/produits` — création
- `PATCH /api/produits/:id` — mise à jour
- `DELETE /api/produits/:id` — suppression

Commercial (`backend/src/app/commercial`)
- `GET /api/commercial` — liste
- `GET /api/commercial/:id` — détail
- `POST /api/commercial` — création
- `PATCH /api/commercial/:id` — mise à jour
- `DELETE /api/commercial/:id` — suppression

Affaire (`backend/src/app/affaire`)
- `GET /api/affaire` — liste
- `GET /api/affaire/:id` — détail
- `POST /api/affaire` — création
- `PATCH /api/affaire/:id` — mise à jour
- `DELETE /api/affaire/:id` — suppression

Dashboard (`backend/src/app/dashboard`)
- `GET /api/dashboard/number_clients` — nombre total de clients (retourne `{ number_client }`)

## Fichiers d’environnement
Front (`apps/avenirFermeture/src/environments/`)
- `environment.development.ts` : `apiUrl: 'http://localhost:3000/api'`
- `environment.ts` : `apiUrl: '/api'` (derrière Nginx en production)

Back (`backend/.env` à créer)
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=avenir_fermeture
DB_SYNC=true
TYPEORM_LOGGING=true
CORS_ORIGIN=http://localhost:4200
```
- `CORS_ORIGIN` : plusieurs origines possibles, séparées par des virgules
- En production, mettez `DB_SYNC=false` et utilisez des migrations

## Build, Docker et déploiement
- Build manuel :
  ```bash
  npx nx build backend
  npx nx build avenirFermeture
  ```
- Sorties :
  - API : `dist/backend` (inclut `main.js`, `package.json`, `package-lock.json`, `workspace_modules/`)
  - Front : `dist/apps/avenirFermeture/browser`
- Dockerfiles :
  - `backend/Dockerfile` — multi-stage Node 20 → build Nx → runner Node (non-root)
  - `apps/avenirFermeture/Dockerfile` — multi-stage Node 20 → build Nx → Nginx (proxy `/api`)
  - `docker/nginx.conf` — SPA fallback + proxy API
- Déploiement Compose :
  ```bash
  docker compose up -d backend frontend
  ```
  (Assurez-vous que `db` est lancé et sain si externe)
- Images locales :
  - `docker build -f backend/Dockerfile -t avenir/backend .`
  - `docker build -f apps/avenirFermeture/Dockerfile -t avenir/frontend .`

## Tests et vérification
- Des fichiers `*.spec.ts` existent (Angular/Nest), aucun runner n’est encore câblé dans les `project.json`
- Ajouter des tests :
  - Front : activer Jest ou Karma via Nx
  - Back : `npx nx g @nx/jest:configuration backend`
- Vérifications manuelles :
  - Utiliser `backend/request.http`
  - Lancer `npx nx lint avenirFermeture`

## Dépannage
- Front ne joint pas l’API :
  - Vérifier le backend (`http://localhost:3000`)
  - Vérifier `environment.development.ts`
  - Ajuster `CORS_ORIGIN`
- MySQL erreurs :
  - Vérifier les identifiants `.env`
  - `DB_SYNC=true` crée le schéma au démarrage (sinon exécuter migrations/dump)
- Ports occupés :
  - Changer `PORT` (backend) ou `--port` pour `nx serve avenirFermeture`
- Caractère non ASCII dans le log Nest (cosmétique) :
  - Message de `Logger.log` dans `backend/src/main.ts`

## Pistes d’évolution
1. Migrations TypeORM pour un schéma reproductible
2. Ajouter Jest (front/back) et pipelines CI
3. Seed de données (script TypeORM ou SQL)
4. Internationalisation de l’UI (et `extract-i18n`)
5. Durcir la config Nginx (cache, headers) et sécuriser les secrets

Bon développement !

