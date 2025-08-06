import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Menu } from './features/menu/menu';
import { Login } from './features/auth/login/login';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'menu', component: Menu },
  { path: 'login', component: Login },
];
