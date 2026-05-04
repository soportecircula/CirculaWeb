import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { ImpactMetricsService } from '../../../client/services';
import * as ImpactMetricsActions from './impact-metrics.actions';

@Injectable()
export class ImpactMetricsEffects {
  private readonly actions$ = inject(Actions);
  private readonly impactMetricsService = inject(ImpactMetricsService);

  loadMetrics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImpactMetricsActions.loadMetrics),
      switchMap(() =>
        this.impactMetricsService.impactMetricsGetImpactMetrics().pipe(
          map((metrics) => ImpactMetricsActions.loadMetricsSuccess({ metrics })),
          catchError(() => of(ImpactMetricsActions.loadMetricsFailure())),
        ),
      ),
    ),
  );
}
