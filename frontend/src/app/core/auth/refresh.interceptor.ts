import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, catchError, finalize, from, map, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { setAccessToken } from './auth-token';

let refreshRequest$: Observable<string> | null = null;

/**
 * Client-scoped refresh interceptor for ng-openapi.
 * Catches auth failures, refreshes the token via fetch(), and retries.
 * Instantiated via `new` by provideDefaultClient — does NOT use Angular DI.
 */
export class RefreshInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (this.shouldTryRefresh(req, err)) {
          return this.handleRefresh(req, next);
        }
        return throwError(() => err);
      }),
    );
  }

  private shouldTryRefresh(req: HttpRequest<unknown>, err: { status?: number; error?: { detail?: string } }): boolean {
    if (req.url.includes('/auth/refresh') || req.url.includes('/login/')) {
      return false;
    }
    if (err.status === 401) {
      return true;
    }
    return err.status === 403 && err.error?.detail === 'Could not validate credentials';
  }

  private handleRefresh(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.getRefreshRequest$().pipe(
      catchError((refreshErr) => {
        setAccessToken(null);
        window.location.href = '/auth/login';
        return throwError(() => refreshErr);
      }),
      switchMap((accessToken) =>
        next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          }),
        ),
      ),
    );
  }

  private getRefreshRequest$(): Observable<string> {
    if (!refreshRequest$) {
      refreshRequest$ = from(
        fetch(`${environment.apiUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        }),
      ).pipe(
        switchMap((res) => {
          if (!res.ok) {
            throw new Error('Refresh failed');
          }
          return from(res.json() as Promise<{ access_token: string }>);
        }),
        map((data) => data.access_token),
        tap((accessToken) => setAccessToken(accessToken)),
        finalize(() => {
          refreshRequest$ = null;
        }),
        shareReplay(1),
      );
    }
    return refreshRequest$;
  }
}
