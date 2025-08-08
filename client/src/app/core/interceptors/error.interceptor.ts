import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error?.error?.message || error.message || 'Request failed';
      errorService.setError(message);

      const unauthorized = error.status === 401 || error.status === 403;
      const invalidToken = /invalid access token/i.test(message);
      if (unauthorized && invalidToken) {
        authService.forceLogout();
        router.navigate(['/auth/login']);
      }

      return throwError(() => error);
    })
  );
};
