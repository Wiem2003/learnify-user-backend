import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { map, take } from 'rxjs';

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/**
 * Guard for "guest" routes (login, signup, etc.).
 * If the user is logged in with a valid (non-expired) JWT → redirect to /.
 * If the JWT is expired → clear session and allow access to auth pages.
 * Otherwise → allow access.
 */
export const guestGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.user$.pipe(
    take(1),
    map((user) => {
      if (!user) return true;

      const token = localStorage.getItem('token') || '';
      if (!token || isJwtExpired(token)) {
        session.clear();
        return true;
      }

      return router.createUrlTree(['/']);
    })
  );
};
