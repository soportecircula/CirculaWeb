import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ImpactMetricsState } from './impact-metrics.models';

export const selectImpactMetricsState = createFeatureSelector<ImpactMetricsState>('impactMetrics');

export const selectMetrics = createSelector(
  selectImpactMetricsState,
  (state) => state.metrics,
);

export const selectMetricsLoading = createSelector(
  selectImpactMetricsState,
  (state) => state.loading,
);

export const selectMetricsError = createSelector(
  selectImpactMetricsState,
  (state) => state.error,
);
