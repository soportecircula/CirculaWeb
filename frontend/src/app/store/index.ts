import { ActionReducerMap } from '@ngrx/store';

import { AuthState } from './Authentication/auth.models';
import { authReducer } from './Authentication/authentication.reducer';
import { LayoutState } from './Layout/layout.models';
import { layoutReducer } from './Layout/layout.reducer';
import { ImpactMetricsState } from './ImpactMetrics/impact-metrics.models';
import { impactMetricsReducer } from './ImpactMetrics/impact-metrics.reducer';
import { ContactState } from './Contact/contact.models';
import { contactReducer } from './Contact/contact.reducer';

export interface RootReducerState {
  auth: AuthState;
  layout: LayoutState;
  impactMetrics: ImpactMetricsState;
  contact: ContactState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  auth: authReducer,
  layout: layoutReducer,
  impactMetrics: impactMetricsReducer,
  contact: contactReducer,
};
