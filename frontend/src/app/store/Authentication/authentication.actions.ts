import { createAction, props } from '@ngrx/store';
import { UserMeResponse } from '../../../client/models';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string; rememberMe: boolean }>(),
);
export const loginSuccess = createAction('[Auth] Login Success');
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

// Load current user
export const loadCurrentUser = createAction('[Auth] Load Current User');
export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: UserMeResponse }>(),
);
export const updateUserFromProfile = createAction(
  '[Auth] Update User From Profile',
  props<{ user: Partial<UserMeResponse> }>(),
);
export const loadCurrentUserFailure = createAction('[Auth] Load Current User Failure');

// Refresh token (on app init / page reload)
export const refreshToken = createAction('[Auth] Refresh Token');
export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success');
export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure');

// Auth initialized (after refresh attempt completes)
export const authInitialized = createAction('[Auth] Initialized');

// Logout
export const logout = createAction('[Auth] Logout');
