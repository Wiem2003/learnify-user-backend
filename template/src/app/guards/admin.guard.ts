import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protège les routes /admin : redirige vers la page de connexion
 * si l'utilisateur n'est pas connecté ou n'a pas le rôle ADMIN.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigateByUrl('/auth/login');
    return false;
  }
  if (!auth.hasRole('ADMIN')) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
