import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { UsersService } from '../../../client/services';
import { AuthService as GeneratedAuthService } from '../../../client/services';
import { environment } from '../../../environments/environment';
import { setAccessToken } from '../../core/auth/auth-token';
import * as AuthActions from './authentication.actions';

@Injectable()
export class AuthenticationEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly authClientService = inject(GeneratedAuthService);
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password, rememberMe }) => {
        const body = new URLSearchParams();
        body.set('username', email);
        body.set('password', password);
        return this.http
          .post<{ access_token: string }>(
            `${environment.apiUrl}/api/v1/login/access-token?remember_me=${rememberMe}`,
            body.toString(),
            {
              headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
              withCredentials: true,
            },
          )
          .pipe(
            tap((res) => setAccessToken(res.access_token)),
            map(() => AuthActions.loginSuccess()),
            catchError((err) =>
              of(
                AuthActions.loginFailure({
                  error: err?.error?.detail || 'Error al iniciar sesión',
                }),
              ),
            ),
          );
      }),
    ),
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => AuthActions.loadCurrentUser()),
    ),
  );

  loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadCurrentUser),
      exhaustMap(() =>
        this.usersService.usersReadUserMe().pipe(
          map((user) => AuthActions.loadCurrentUserSuccess({ user })),
          catchError(() => of(AuthActions.loadCurrentUserFailure())),
        ),
      ),
    ),
  );

  initAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.authClientService
          .authRefreshToken('body', { withCredentials: true })
          .pipe(
            tap((res) => setAccessToken(res.access_token)),
            switchMap(() => [
              AuthActions.refreshTokenSuccess(),
              AuthActions.loadCurrentUser(),
            ]),
            catchError(() => of(AuthActions.refreshTokenFailure())),
          ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          this.authClientService
            .authLogout('body', { withCredentials: true })
            .pipe(catchError(() => of(null))),
        ),
        tap(() => {
          setAccessToken(null);
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );
}
