import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.models';
import * as AuthActions from './authentication.actions';

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
    initialized: false,
  })),
  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    initialized: false,
  })),
  on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    initialized: true,
  })),
  on(AuthActions.updateUserFromProfile, (state, { user }) => ({
    ...state,
    user: state.user ? { ...state.user, ...user } : state.user,
  })),
  on(AuthActions.loadCurrentUserFailure, (state) => ({
    ...state,
    user: null,
    loading: false,
    initialized: true,
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    loading: true,
    initialized: false,
  })),
  on(AuthActions.refreshTokenSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(AuthActions.refreshTokenFailure, (state) => ({
    ...state,
    user: null,
    loading: false,
    initialized: true,
  })),

  on(AuthActions.authInitialized, (state) => ({
    ...state,
    initialized: true,
  })),

  on(AuthActions.logout, () => ({
    ...initialState,
    initialized: true,
  })),
);
