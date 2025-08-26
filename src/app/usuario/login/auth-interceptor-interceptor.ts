import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);

  // No agregar token si es la petición de login
  if (req.url.includes('/oauth/token')) {
    return next(req);
  }

  const token = authService.token;

  // Clonar la request y agregar el header Authorization si hay token
  const clonedRequest = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(clonedRequest);
};
