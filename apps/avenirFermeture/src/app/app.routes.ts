import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/home/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'clients',
    loadComponent: () => import('./features/clients/list/clients').then(m => m.Clients),
  },
  {
    path: 'commercial',
    loadComponent: () => import('./components/view/commercial/commercial').then(m => m.Commercial),
  },

  {
    path: 'comptabilite',
    loadComponent: () => import('./components/view/comptabilite/comptabilite').then(m => m.Comptabilite),
  },
  {
    path: 'dev-ajout-produit',
    loadComponent: () => import('./components/view/ajoutProduit/ajoutProduit').then(m => m.AjoutProduit),
  },
  {
    path: 'cree-client',
    loadComponent: () => import('./features/clients/add/addClient').then(m => m.AddClient),
  },
  {
    path: 'edit-client/:code-client',
    loadComponent: () => import('./features/clients/edit/edit-client').then(m => m.EditClient),
  },
  {
    path: 'one-client/create-commande',
    loadComponent: () => import('./features/commandes/create/create-commandes').then(m => m.CreateCommandes),
  },
  {
    path: 'one-client/:code-client',
    loadComponent: () => import('./features/clients/detail/one-client').then(m => m.OneClientComponent),

  },
  {
    path: 'test',
    loadComponent: () => import('./components/view/test/test').then(m => m.Test),
  }
];
