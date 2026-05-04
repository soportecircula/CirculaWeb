import { createAction, props } from '@ngrx/store';
import { ImpactMetricRead } from '../../../client/models';

export const loadMetrics = createAction('[ImpactMetrics] Load Metrics');

export const loadMetricsSuccess = createAction(
  '[ImpactMetrics] Load Metrics Success',
  props<{ metrics: ImpactMetricRead[] }>(),
);

export const loadMetricsFailure = createAction('[ImpactMetrics] Load Metrics Failure');
