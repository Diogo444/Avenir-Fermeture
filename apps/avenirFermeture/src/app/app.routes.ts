import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/view/clients/clients').then(m => m.Clients),
  }
];
