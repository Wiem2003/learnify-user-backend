import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Ajoute l'en-tête Authorization: <sessionId> attendu par le backend.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionId = this.auth.getSessionId();
    const isAuthEndpoint = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');

    const requestToSend =
      sessionId && !isAuthEndpoint
        ? req.clone({
            setHeaders: {
              Authorization: sessionId,
            },
          })
        : req;

    return next.handle(requestToSend).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 403) {
          this.auth.clearLocalSession();
        }
        return throwError(() => err);
      })
    );
  }
}

