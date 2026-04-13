import { ActionReducerMap } from '@ngrx/store';

import { AuthState } from './Authentication/auth.models';
import { authReducer } from './Authentication/authentication.reducer';
import { LayoutState } from './Layout/layout.models';
import { layoutReducer } from './Layout/layout.reducer';

export interface RootReducerState {
  auth: AuthState;
  layout: LayoutState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  auth: authReducer,
  layout: layoutReducer,
};
