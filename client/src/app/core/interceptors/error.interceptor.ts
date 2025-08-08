import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const msg =
        err?.error?.message ||
        err?.error?.error?.message ||
        err.message ||
        'Request failed';
      errorService.setError(msg);
      return throwError(() => err);
    })
  );
};
