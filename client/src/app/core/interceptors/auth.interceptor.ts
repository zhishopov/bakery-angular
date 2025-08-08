import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();
  const isApi = req.url.startsWith('http://localhost:3030/');

  const needsAuth =
    req.method !== 'GET' ||
    req.url.includes('/data/bookings') ||
    req.url.includes('/users');

  if (isApi && token && needsAuth) {
    req = req.clone({ setHeaders: { 'X-Authorization': token } });
  }

  return next(req);
};
