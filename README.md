# AvenirFermeture - Guide complet

Monorepo Nx regroupant une application Angular (front) et une API NestJS (back) pour la gestion d'une entreprise de fermeture. Ce guide resume les commandes a connaitre, l'architecture du projet, les routes exposees et les scenarios de deploiement.

## Sommaire
- Prerequis
- Demarrage rapide avec Docker
- Developpement local sans Docker
- Commandes Nx et npm
- Architecture du monorepo
- Frontend Angular
- Backend NestJS et base de donnees
- API REST
- Fichiers d'environnement
- Build, images Docker et deploiement
- Tests et verification
- Depannage express
- Pistes d'evolution

## Prerequis
- Node.js 20.x (npm 10 fourni)
- Docker Desktop (optionnel mais pratique)
- MySQL 8.x si vous ne passez pas par Docker
- Git et un terminal disposant de `npx`

## Demarrage rapide avec Docker
1. Construire et lancer l'ensemble (BDD + API + front) depuis la racine :
   ```bash
   docker compose up --build
   ```
2. Front Angular disponible sur `http://localhost:8080`
3. API NestJS disponible via Nginx sur `http://localhost:8080/api` et en direct sur `http://localhost:3000/api`

Details :
- Service `db` : MySQL 8 avec volumes persistes (`mysql_data`), identifiants definis dans `docker-compose.yml`
- Service `backend` : build NestJS via `backend/Dockerfile`, variables d'environnement injectees pour TypeORM
- Service `frontend` : build Angular production via `apps/avenirFermeture/Dockerfile`, assets servis par Nginx qui proxifie `/api` vers le backend
- Pour purger la stack : `docker compose down -v`

## Developpement local sans Docker
1. Installer les dependances du workspace :
   ```bash
   npm ci
   ```
2. Preparer MySQL :
   - Creer une base (ex : `avenir_fermeture`)
   - Copier `backend/.env.example` vers `backend/.env` et ajuster les variables (voir section Fichiers d'environnement)
3. Lancer l'API NestJS en mode dev :
   ```bash
   npx nx serve backend
   ```
   - Serveur sur `http://localhost:3000/api`
   - Hot reload gere par Webpack
4. Lancer l'appli Angular :
   ```bash
   npx nx serve avenirFermeture
   ```
   - Serveur sur `http://localhost:4200`
   - Le front pointe vers `http://localhost:3000/api` (voir `environment.development.ts`)
5. (Optionnel) Lancer les deux en parallele :
   ```bash
   npx nx run-many -t serve --projects=backend,avenirFermeture
   ```
6. Arreter proprement avec `Ctrl + C` sur chaque terminal

## Commandes Nx et npm
Commandes courantes :
- `npx nx serve avenirFermeture` : dev server Angular (config `development`)
- `npx nx build avenirFermeture` : build production (sortie `dist/apps/avenirFermeture/browser`)
- `npx nx serve backend` : dev server NestJS (build incremental)
- `npx nx build backend` : build webpack (sortie `dist/backend`)
- `npx nx run backend:serve --configuration=production` : serve le bundle compile
- `npx nx run avenirFermeture:serve-static` : servir la version build via file server Nx
- `npx nx graph` : visualiser les dependances des projets

Alias npm (voir `package.json`) pour generer via Nx :
- `npm run ngc -- chemin/nom` : composant Angular standalone
- `npm run ngs -- chemin/nom` : service Angular
- `npm run ngm -- chemin/nom` : module Angular (si besoin)
- `npm run ngp -- chemin/nom` : pipe Angular
- `npm run nc -- nom` : controller Nest
- `npm run ns -- nom` : service Nest
- `npm run nm -- nom` : module Nest
- `npm run nr -- nom` : resource Nest (module + controller + service)
- `npm run g -- <schematics>` : passe-plat vers `nx g`

Targets utiles cote backend :
- `backend:prune` (apres build) : genere package-lock et copie des deps production dans `dist/backend`
- `backend:prune-lockfile` : sous-tache appelee par `prune`
- `backend:copy-workspace-modules` : copie des modules npm necessaires

## Architecture du monorepo
```
.
|- apps/
|  |- avenirFermeture/          # Application Angular 20
|- backend/                     # API NestJS 11 + TypeORM
|- backend-e2e/                 # Placeholder pour tests end-to-end (non configure)
|- docker/                      # Config Nginx pour prod containerisee
|- dist/                        # Builds generes par Nx (ignore en Git)
|- nx.json, package.json, tsconfig.base.json
`- .nx, .angular, .vscode, .github ...
```

Focus dossiers :
- `apps/avenirFermeture/src/app` : composants standalone, routes (`app.routes.ts`), configuration (`app.config.ts`), services (`services/api/api.ts`) et models
- `backend/src/app` : modules Nest (Clients, Produits, Dashboard, Commercial), DTO et entites TypeORM
- `backend/request.http` : collection de requetes pour tester l'API avec VS Code REST Client/httpYac

## Frontend Angular
- Version Angular 20, standalone components, Angular Material et Bootstrap
- Configuration globale dans `app.config.ts` :
  - `provideRouter(appRoutes)` (routing standalone)
  - `provideHttpClient()` (HttpClient injection)
  - `provideAnimations()` (support animations Material)
- Composant racine `App` (`app.ts`) : charge `Navbar` + outlet router
- Service central `Api` (`services/api/api.ts`) :
  - Propose `getClients`, `getNumberClients`, `getProduits`, `ajoutProduit`, `createClient`, `createCommercial`, `getCommercials`, `deleteClient`
  - Base URL alignee sur les environnements (`environment*.ts`)
- Models situes dans `src/app/models` (clients, DTO creation client, nombre de clients)
- Pages principales (`components/view/`) :
  - `dashboard` : KPIs + compteur clients via `/dashboard/number_clients`
  - `clients` : listing clients, suppression, navigation vers creation
  - `addClient` : formulaire reactif complet (liaison produits et commerciaux)
  - `ajoutProduit` : CRUD minimal sur les produits
  - `commercial` et `comptabilite` : squelettes pour evolutions futures
  - `one-client` : composant en cours de construction (route definie mais lazy load a completer)
- Routage (`app.routes.ts`) :
  - `/` -> `Dashboard`
  - `/clients` -> `Clients`
  - `/commercial` -> `Commercial`
  - `/comptabilite` -> `Comptabilite`
  - `/dev-ajout-produit` -> `AjoutProduit`
  - `/cree-client` -> `AddClient`
  - `/one-client/:code-client` -> TODO (lazy load non branche)

## Backend NestJS et base de donnees
- NestJS 11, TypeORM, build webpack via Nx
- `main.ts` :
  - Active CORS (`CORS_ORIGIN` ou `*`)
  - Prefix global `/api`
  - Port par defaut `3000`
- `AppModule` :
  - `TypeOrmModule.forRoot` configure via variables d'environnement (MySQL)
  - Modules importes : `ClientModule`, `ProduitsModule`, `DashboardModule`, `CommercialModule`
  - `synchronize` actif par defaut (a desactiver en production si vous avez des migrations)
- Modules fonctionnels :
  - `Clients` : gestion clients (TypeORM entity `Client`, relations `ManyToMany` avec `Produit` et `Commercial`)
  - `Produits` : gestion produits (entity `Produit`)
  - `Commercial` : gestion commerciaux (entity `Commercial`)
  - `Dashboard` : expose un compteur global de clients
- Services :
  - `ClientService` : lecture avec relations, creation avec jointures, suppression
  - `ProduitsService` : CRUD simple + NotFoundException
  - `CommercialService` : CRUD (lecture complete, update/delete)
  - `DashboardService` : retourne `{ number_client }`
- DTO :
  - `Clients/dto/create-client.dto.ts` : structure attendue a l'API (IDs de produits et commerciaux optionnels)
  - `commercial/dto` : DTO creation et update
  - `app/dto` : DTO partages
- `request.http` : exemples `GET/POST/DELETE` pour les principales routes

### Schema TypeORM (resume)
- Table `clients` :
  - Identifiant auto (`id`), `code_client` unique, informations contact/adresse
  - Champs financiers : montants, semaines, etats et notes pour acompte metre/livraison et solde
  - Champs livraison (`semain_livraison_souhaite`, `livraison_limite`)
  - Timestamps `created_at`, `updated_at`
- Table `produits` : `id`, `nom`
- Table `commercials` : `id`, `firstName`, `lastName`
- Tables pivots automatiques : `clients_produits`, `clients_commercials`

## API REST
Prefix global : `/api`

### Clients (`backend/src/app/Clients`)
- `GET /api/clients` : liste des clients avec relations produits/commerciaux
- `POST /api/clients/create` : creation d'un client
- `DELETE /api/clients/:id` : suppression d'un client

### Produits (`backend/src/app/produits`)
- `GET /api/produits` : liste de tous les produits
- `GET /api/produits/:id` : detail d'un produit (404 si absent)
- `POST /api/produits` : creation d'un produit

### Commercial (`backend/src/app/commercial`)
- `GET /api/commercial` : liste des commerciaux
- `GET /api/commercial/:id` : detail (placeholder a remplacer par un vrai retour)
- `POST /api/commercial` : creation d'un commercial
- `PATCH /api/commercial/:id` : mise a jour
- `DELETE /api/commercial/:id` : suppression

### Dashboard (`backend/src/app/dashboard`)
- `GET /api/dashboard/number_clients` : nombre total de clients

## Fichiers d'environnement
- Front (`apps/avenirFermeture/src/environments/`) :
  - `environment.development.ts` : `apiUrl: 'http://localhost:3000/api'`
  - `environment.ts` : `apiUrl: '/api'` (proxifie par Nginx en production)
- Back (`backend/.env`) :
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
  - `CORS_ORIGIN` peut contenir plusieurs origines separees par des virgules
  - `DB_SYNC=false` recommande en production (utiliser des migrations)

## Build, images Docker et deploiement
- Build manuel :
  ```bash
  npx nx build backend
  npx nx build avenirFermeture
  ```
- Outputs :
  - API : `dist/backend` (contient `main.js`, `package.json`, `package-lock.json`, `workspace_modules/`)
  - Front : `dist/apps/avenirFermeture/browser`
- Dockerfiles :
  - `backend/Dockerfile` : multi-stage Node 20 -> install deps -> build Nx -> runner Node non root
  - `apps/avenirFermeture/Dockerfile` : multi-stage Node 20 -> build Nx -> runner Nginx avec proxy `/api`
  - `docker/nginx.conf` : fallback SPA + proxy API
- Deploiement compose :
  ```bash
  docker compose up -d backend frontend
  ```
  (la base `db` doit etre provisionnee si vous ne la lancez pas dans Compose)
- Publication individuelle :
  - `docker build -f backend/Dockerfile -t avenir/backend .`
  - `docker build -f apps/avenirFermeture/Dockerfile -t avenir/frontend .`

## Tests et verification
- Des fichiers `*.spec.ts` sont presents (Angular et Nest) mais aucun runner n'est configure dans `project.json`
- Ajouter des tests :
  - Front : activer Jest ou Karma via `nx g @nx/angular:setup-tailwind` / `nx g @nx/angular:application --unit-test-runner=jest`
  - Back : `npx nx g @nx/jest:configuration backend`
- Tests manuels possibles :
  - Utiliser `backend/request.http`
  - Verifier le front via `npm run ngc` pour generer des composants de test

## Depannage express
- Front ne touche pas l'API :
  - Verifier que le backend tourne sur `http://localhost:3000`
  - Verifier `environment.development.ts`
  - CORS : ajuster `CORS_ORIGIN`
- Erreurs MySQL :
  - Verifier credos dans `.env`
  - `DB_SYNC` cree le schema au demarrage; sinon exporter un dump
- Ports deja utilises :
  - Changer `PORT` (backend) ou `--port` pour `nx serve avenirFermeture`
- Caractere etrange dans les logs Nest :
  - Le message `Logger.log` contient un caractere non ASCII residuel (`main.ts`). Purement cosmetique.

## Pistes d'evolution
1. Finaliser la route `/one-client/:code-client` avec un composant detail
2. Ajouter des migrations TypeORM pour un schema reproductible
3. Configurer Jest (front et back) et les pipelines CI (`.github/`)
4. Ajouter du seed data automatise (script TypeORM ou SQL)
5. Internationaliser l'UI (assets i18n, `extract-i18n`)

Bon developpement !

