# AvenirFermeture – Guide Complet

Application de gestion pour une entreprise de menuiserie/fermeture, construite en monorepo Nx avec :
- Frontend Angular (Material) dans `apps/avenirFermeture`
- Backend NestJS (TypeORM + MySQL) dans `backend`

Ce document explique comment installer, lancer, comprendre l’architecture, les composants, les routes et les API exposées.

**Sommaire**
- Prérequis
- Démarrage rapide (Docker)
- Installation locale (dev)
- Scripts utiles (Nx)
- Architecture du projet
- Composants et pages
- Service API et environnements
- Endpoints API (backend)
- Build et déploiement
- Dépannage

## Prérequis
- Node.js 20.x et npm 10.x
- Docker (optionnel mais recommandé pour un démarrage rapide)
- MySQL 8.x (si vous lancez localement sans Docker)

## Démarrage rapide (Docker)
Le plus simple pour tout lancer (DB + API + Front) est d’utiliser `docker-compose` à la racine.

1) Lancer l’ensemble des services :
   - `docker compose up --build`
2) Accéder à l’application Angular :
   - `http://localhost:8080`
3) L’API NestJS est exposée derrière Nginx sur `/api` et écoute en interne sur `http://backend:3000`.

Notes Docker :
- Le service `db` lance MySQL avec une base initiale. Les identifiants sont définis dans `docker-compose.yml`.
- Le backend utilise `DB_SYNC=true` (création du schéma à chaud, à désactiver en prod si vous passez par des migrations).
- Le frontend est servi par Nginx, qui proxifie les requêtes `/api` vers le backend.

## Installation locale (dev)
Si vous préférez développer sans Docker (front et back lancés dans votre machine), suivez ces étapes :

1) Installer les dépendances du monorepo Nx :
   - `npm ci`

2) Démarrer MySQL localement et créer une base (ex : `avenir_fermeture`).

3) Configurer les variables d’environnement du backend :
   - Copiez `backend/.env.example` vers `backend/.env`
   - Ajustez `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
   - Laissez `DB_SYNC=true` en dev pour créer automatiquement les tables

4) Lancer le backend en mode développement :
   - `npx nx serve backend`
   - Le backend écoute sur `http://localhost:3000/api`

5) Lancer le frontend Angular :
   - `npx nx serve avenirFermeture`
   - Le front écoute par défaut sur `http://localhost:4200`

6) Vérifier l’URL d’API du front (dev) :
   - `apps/avenirFermeture/src/environments/environment.development.ts` définit `apiUrl: 'http://localhost:3000/api'`
   - Aucune modification n’est nécessaire si le backend est sur le port 3000.

## Scripts utiles (Nx)
- Lancer le frontend en dev : `npx nx serve avenirFermeture`
- Builder le frontend (prod) : `npx nx build avenirFermeture`
- Lancer le backend en dev : `npx nx serve backend`
- Builder le backend (webpack) : `npx nx build backend`
- Voir les cibles du projet front : `npx nx show project avenirFermeture`
- Voir les cibles du projet back : `npx nx show project backend`

## Architecture du projet
- `apps/avenirFermeture` : application Angular 20 (standalone components)
  - `src/app/app.routes.ts` : définition des routes
  - `src/app/services/api/api.ts` : service central pour appeler l’API
  - `src/app/components/...` : composants de pages et utilitaires (Navbar, etc.)
  - `src/environments/` : configuration des URLs d’API selon l’environnement
- `backend` : application NestJS 11 + TypeORM (MySQL)
  - `src/app/Clients` : module clients (controller, service, entity)
  - `src/app/produits` : module produits
  - `src/app/dashboard` : module tableau de bord (indicateurs)
  - `src/main.ts` : bootstrap NestJS + CORS + prefix global `/api`
- `docker/` : configuration Nginx pour servir le SPA et proxifier l’API
- `docker-compose.yml` : orchestration des services (db, backend, frontend)

## Composants et pages (Frontend)
- `Navbar` (`components/utils/navbar`) :
  - Barre latérale de navigation (Angular Material Icons + liens `routerLink`)
  - Liens disponibles : `Dashboard`, `Clients`, `Commercial`, `Comptabilité`, `Ajout produit (dev)`

- `Dashboard` (`components/view/dashboard`) :
  - Vue d’ensemble des indicateurs clés et plan d’actions (données UI statiques + compteur de clients)
  - Appel API : `GET /dashboard/number_clients` pour afficher `client_number.number_client`

- `Clients` (`components/view/clients`) :
  - Liste des clients (nom, prénom, email)
  - Appel API : `GET /clients`
  - Bouton “Ajouter un client” qui redirige vers `/cree-client`

- `AddClient` (`components/view/addClient`) :
  - Formulaire réactif complet (Angular Reactive Forms + Material) pour créer un client
  - Charge la liste des produits (`GET /produits`) pour un champ multi-sélection
  - Soumission : `POST /clients/create`, puis redirection vers `/clients`

- `AjoutProduit` (`components/view/ajoutProduit`) :
  - Ajout rapide d’un produit (nom)
  - Liste les produits existants
  - API : `GET /produits`, `POST /produits`

- `Commercial` et `Comptabilite` :
  - Pages présentes mais encore simples (squelettes) prêtes pour des fonctionnalités futures.

## Routes (Frontend)
Définies dans `apps/avenirFermeture/src/app/app.routes.ts` :
- `/` → Dashboard
- `/clients` → Liste des clients
- `/commercial` → Page commerciale
- `/comptabilite` → Page comptabilité
- `/dev-ajout-produit` → Ajout produit (vue dev)
- `/cree-client` → Formulaire d’ajout client

## Service API et environnements (Frontend)
- Service central : `apps/avenirFermeture/src/app/services/api/api.ts`
  - Utilise `environment.apiUrl` (`/api` en prod via Nginx, `http://localhost:3000/api` en dev)
  - Méthodes :
    - `getClients()` → `GET {apiUrl}/clients`
    - `getNumberClients()` → `GET {apiUrl}/dashboard/number_clients`
    - `getProduits()` → `GET {apiUrl}/produits`
    - `ajoutProduit(produit)` → `POST {apiUrl}/produits`
    - `createClient(dto)` → `POST {apiUrl}/clients/create`

- Environnements :
  - Dev : `apps/avenirFermeture/src/environments/environment.development.ts`
    - `apiUrl: 'http://localhost:3000/api'`
  - Prod : `apps/avenirFermeture/src/environments/environment.ts`
    - `apiUrl: '/api'` (proxifié par Nginx)

## Endpoints API (Backend NestJS)
Prefix global : `/api`

- Clients (`backend/src/app/Clients`) :
  - `GET /api/clients` → liste des clients
  - `POST /api/clients/create` → création d’un client

- Produits (`backend/src/app/produits`) :
  - `GET /api/produits` → liste des produits
  - `GET /api/produits/:id` → détail d’un produit
  - `POST /api/produits` → création d’un produit

- Dashboard (`backend/src/app/dashboard`) :
  - `GET /api/dashboard/number_clients` → nombre total de clients

Base de données : MySQL via TypeORM. En dev (par défaut), `synchronize=true` permet de créer/mettre à jour le schéma automatiquement.

Variables d’environnement backend (exemple dans `backend/.env.example`) :
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=avenir_fermeture
DB_SYNC=true
TYPEORM_LOGGING=true
```

## Build et déploiement
- Frontend (build local) : `npx nx build avenirFermeture`
  - Sortie : `dist/apps/avenirFermeture/browser`
- Backend (build local) : `npx nx build backend`
  - Sortie : `dist/backend`
- Docker :
  - Frontend image : construit via `apps/avenirFermeture/Dockerfile` (Nginx + assets)
  - Backend image : construit via `backend/Dockerfile` (Node.js runtime, non-root user)
  - Orchestration : `docker-compose.yml` (services `db`, `backend`, `frontend`)

## Dépannage
- “Le front n’arrive pas à joindre l’API en local”
  - Vérifiez que le backend tourne sur `http://localhost:3000`
  - Vérifiez `apps/.../environment.development.ts` → `apiUrl`
- “Tables manquantes en base”
  - Assurez-vous que `DB_SYNC=true` en dev ou appliquez vos migrations manuelles
- “CORS en erreur”
  - En Docker Compose, `CORS_ORIGIN` autorise `http://localhost:8080`
  - En local, vérifiez le header `Origin` et ajustez la variable d’env si besoin

---

Pour toute question ou amélioration (tests, données de démo/seed, CI/CD), n’hésitez pas à ouvrir une issue ou à proposer une PR.

