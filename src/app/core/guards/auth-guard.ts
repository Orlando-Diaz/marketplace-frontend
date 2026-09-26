import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Sin sesión: al login, recordando a dónde quería ir
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};