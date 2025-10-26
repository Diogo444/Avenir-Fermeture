import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/view/dashboard/dashboard').then(m => m.Dashboard),
  },
  {
    path: 'clients',
    loadComponent: () => import('./components/view/clients/clients').then(m => m.Clients),
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
    loadComponent: () => import('./components/view/addClient/addClient').then(m => m.AddClient),
  },
  {
    path: 'one-client/:code-client',
    loadComponent: () => import('./components/view/one-client/one-client').then(m => m.OneClientComponent),

  }
];
