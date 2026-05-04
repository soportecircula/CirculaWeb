import { createReducer, on } from '@ngrx/store';
import { ImpactMetricsState } from './impact-metrics.models';
import * as ImpactMetricsActions from './impact-metrics.actions';

export const initialState: ImpactMetricsState = {
  metrics: [],
  loading: false,
  error: false,
};

export const impactMetricsReducer = createReducer(
  initialState,

  on(ImpactMetricsActions.loadMetrics, (state) => ({
    ...state,
    loading: true,
    error: false,
  })),

  on(ImpactMetricsActions.loadMetricsSuccess, (state, { metrics }) => ({
    ...state,
    metrics,
    loading: false,
    error: false,
  })),

  on(ImpactMetricsActions.loadMetricsFailure, (state) => ({
    ...state,
    loading: false,
    error: true,
  })),
);
