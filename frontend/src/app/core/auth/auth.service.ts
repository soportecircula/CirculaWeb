import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Observable, of, switchMap, take, throwError } from 'rxjs';
import { RootReducerState } from '../../store';
import * as AuthActions from '../../store/Authentication/authentication.actions';
import {
  selectUser,
  selectAuthLoading,
  selectIsSuperAdmin,
  selectPlanType
} from '../../store/Authentication/authentication.selectors';
import { getAccessToken } from './auth-token';

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly store = inject(Store<RootReducerState>);
  private readonly actions$ = inject(Actions);

  private readonly userSignal = this.store.selectSignal(selectUser);
  private readonly loadingSignal = this.store.selectSignal(selectAuthLoading);
  private readonly isSuperAdminSignal = this.store.selectSignal(selectIsSuperAdmin);
  //Select Plan
  private readonly planTypeSignal = this.store.selectSignal(selectPlanType)

  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isLoading = computed(() => this.loadingSignal());
  readonly isSuperAdmin = computed(() => this.isSuperAdminSignal());
  //Select Plan
  readonly planType = computed(() => this.planTypeSignal());
  readonly canAccessDiagnostico = computed(() => this.isSuperAdmin() || this.planTypeSignal() !== null);
  readonly canAccessSoftware = computed(() => this.isSuperAdmin() || ['demo_indv', 'demo_col', 'demo_esg'].includes(this.planTypeSignal() ?? ''));
  readonly canAccessMarketplace = computed(() => this.isSuperAdmin() || ['demo_col', 'demo_esg'].includes(this.planTypeSignal() ?? ''));
  readonly canAccessEsg = computed(() => this.isSuperAdmin() || this.planTypeSignal() === 'demo_esg');

  login(email: string, password: string, rememberMe = false): Observable<TokenResponse> {
    this.store.dispatch(AuthActions.login({ email, password, rememberMe }));
    return this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.loginFailure),
      take(1),
      switchMap((action) => {
        if (action.type === AuthActions.loginFailure.type) {
          return throwError(() => ({
            error: { detail: (action as ReturnType<typeof AuthActions.loginFailure>).error },
          }));
        }
        return of({ access_token: 'in-memory', token_type: 'bearer' } as TokenResponse);
      }),
    );
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  getToken(): string | null {
    return getAccessToken();
  }

  refreshUser(): void {
    this.store.dispatch(AuthActions.loadCurrentUser());
  }

  getDefaultRedirectPath(): string {
    const user = this.userSignal();
    if (!user) return '/auth/login';
    return '/dashboard';
  }
}
