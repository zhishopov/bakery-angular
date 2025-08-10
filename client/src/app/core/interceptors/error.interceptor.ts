import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const errors = inject(ErrorService);

  const isApi = req.url.startsWith('http://localhost:3030/');
  const isLogoutCall = req.url.endsWith('/users/logout');
  const isAuthEndpoint =
    req.url.includes('/users/login') || req.url.includes('/users/register');

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message =
        err?.error?.message ||
        err?.error?.error?.message ||
        err.message ||
        'Request failed.';
      errors.setError(message);

      if (
        isApi &&
        (err.status === 401 || err.status === 403) &&
        !isLogoutCall &&
        !isAuthEndpoint
      ) {
        if (auth.isLoggedIn) {
          auth.forceLogout();
        }
        router.navigate(['/auth/login'], {
          state: { message: 'Session expired. Please log in again.' },
        });
      }

      return throwError(() => err);
    })
  );
};
