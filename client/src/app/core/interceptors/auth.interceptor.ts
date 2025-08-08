import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const isApi = req.url.startsWith('http://localhost:3030/');
  if (token && isApi) {
    req = req.clone({
      setHeaders: { 'X-Authorization': token },
    });
  }

  return next(req);
};
