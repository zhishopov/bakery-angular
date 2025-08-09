import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

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
    path: 'book',
    canMatch: [
      () =>
        inject(AuthService).isLoggedIn ||
        inject(Router).createUrlTree(['/auth/login']),
    ],
    loadComponent: () =>
      import('./features/book-table/book-table').then((c) => c.BookTable),
  },
  {
    path: 'bookings',
    canMatch: [
      () => {
        const auth = inject(AuthService);
        const router = inject(Router);
        if (!auth.isLoggedIn) return router.createUrlTree(['/auth/login']);
        if (auth.isAdmin) return router.createUrlTree(['/admin/dashboard']);
        return true;
      },
    ],
    loadComponent: () =>
      import('./features/bookings/bookings').then((c) => c.Bookings),
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canMatch: [
          () =>
            !inject(AuthService).isLoggedIn ||
            inject(Router).createUrlTree(['/home']),
        ],
        loadComponent: () =>
          import('./features/auth/login/login').then((c) => c.Login),
      },
      {
        path: 'register',
        canMatch: [
          () =>
            !inject(AuthService).isLoggedIn ||
            inject(Router).createUrlTree(['/home']),
        ],
        loadComponent: () =>
          import('./features/auth/register/register').then((c) => c.Register),
      },
    ],
  },

  {
    path: 'admin',
    canMatch: [
      () =>
        inject(AuthService).isAdmin || inject(Router).createUrlTree(['/home']),
    ],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/admin-dashboard/admin-dashboard').then(
            (c) => c.AdminDashboard
          ),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/admin-products/admin-products').then(
            (c) => c.AdminProducts
          ),
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/admin/admin-product-edit/admin-product-edit').then(
            (c) => c.AdminProductEdit
          ),
      },
    ],
  },

  { path: '**', redirectTo: '/home' },
];
