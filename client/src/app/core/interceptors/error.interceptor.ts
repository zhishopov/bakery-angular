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

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg =
        err?.error?.message ||
        err?.error?.error?.message ||
        err.message ||
        'Request failed.';
      errors.setError(msg);

      if (isApi && err.status === 401 && !isLogoutCall) {
        auth.forceLogout();
        router.navigate(['/auth/login'], {
          state: { message: 'Session expired. Please log in again.' },
        });
      }

      return throwError(() => err);
    })
  );
};
