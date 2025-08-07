import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home').then((c) => c.Home),
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu').then((c) => c.Menu),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/product-details/details/details').then(
        (c) => c.Details
      ),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login').then((c) => c.Login),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then((c) => c.Register),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/home',
  },
];
