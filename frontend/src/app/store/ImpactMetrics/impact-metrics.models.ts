import { ImpactMetricRead } from '../../../client/models';

export interface ImpactMetricsState {
  metrics: ImpactMetricRead[];
  loading: boolean;
  error: boolean;
}
