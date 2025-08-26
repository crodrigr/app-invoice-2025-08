import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario está autenticado
  if (authService.isAuthenticated()) {
    // Validar si el token está expirado
    if (isTokenExpirado(authService)) {
      authService.logout();
      router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // Si no está autenticado, redirigir al login
  router.navigate(['/login']);
  return false;
};

// Función auxiliar para validar la expiración del token
function isTokenExpirado(authService: AuthService): boolean {
  const token = authService.token;
  if (!token) return true;

  const payload = authService.obtenerDatosToken(token);
  const now = new Date().getTime() / 1000;

  return payload.exp < now;
};
