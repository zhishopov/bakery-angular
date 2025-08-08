import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status;

      if ((status === 401 || status === 403) && authService.isLoggedIn) {
        const msg = 'Your session has expired. Please log in again.';
        errorService.setError(msg);

        authService.logout().subscribe({
          error: () => {
            router.navigate(['/auth/login'], { state: { message: msg } });
          },
          complete: () => {
            router.navigate(['/auth/login'], { state: { message: msg } });
          },
        });
      } else {
        const msg =
          error?.error?.message ||
          error?.error?.error?.message ||
          error.message ||
          'Request failed.';
        errorService.setError(msg);
      }

      return throwError(() => error);
    })
  );
};
