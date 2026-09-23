import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obtenerToken();

  if (token) {
    const tokenReal = JSON.parse(token).token;
    const reqClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenReal}`
      }
    });
    return next(reqClonada);
  }

  return next(req);
};