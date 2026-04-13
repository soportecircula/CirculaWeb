import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getAccessToken } from './auth-token';

/**
 * Client-scoped auth interceptor for ng-openapi.
 * Instantiated via `new` by provideDefaultClient — does NOT use Angular DI.
 */
export class AuthClientInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = getAccessToken();
    if (token && !req.headers.has('Authorization')) {
      return next.handle(
        req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        }),
      );
    }
    return next.handle(req);
  }
}
