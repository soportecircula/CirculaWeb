import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { ProducerRead } from '../../../client/models';
import { RepService } from '../../../client/services';
import { getApiErrorDetail } from '../../core/notifications/messages';
import { NotificationService } from '../../core/notifications/notification.service';
import * as RepActions from './rep.actions';

@Injectable()
export class RepEffects {
  private readonly actions$ = inject(Actions);
  private readonly repService = inject(RepService);
  private readonly notif = inject(NotificationService);

  loadObligations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.loadObligations),
      exhaustMap(() =>
        this.repService.repListObligations().pipe(
          map((obligations) => RepActions.loadObligationsSuccess({ obligations })),
          catchError(() => of(RepActions.loadObligationsFailure())),
        ),
      ),
    ),
  );

  loadMyProducers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.loadMyProducers),
      exhaustMap(() =>
        this.repService.repListMyProducers().pipe(
          map((producers) => RepActions.loadMyProducersSuccess({ producers })),
          catchError(() => of(RepActions.loadMyProducersFailure())),
        ),
      ),
    ),
  );

  addProducer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.addProducer),
      exhaustMap(({ data }) =>
        this.repService.repAddProducer(data).pipe(
          tap(() => this.notif.success('Productor agregado correctamente.')),
          map((producer) => RepActions.addProducerSuccess({ producer })),
          catchError((err) =>
            of(RepActions.addProducerFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  updateProducerById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.updateProducerById),
      exhaustMap(({ id, data }) =>
        this.repService.repUpdateProducer(id, data).pipe(
          tap(() => this.notif.success('Productor actualizado correctamente.')),
          map((producer) => RepActions.updateProducerByIdSuccess({ producer })),
          catchError((err) =>
            of(RepActions.updateProducerByIdFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  loadSectors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.loadSectors),
      exhaustMap(() =>
        this.repService.repListSectors().pipe(
          map((sectors) => RepActions.loadSectorsSuccess({ sectors })),
          catchError(() => of(RepActions.loadSectorsFailure())),
        ),
      ),
    ),
  );

  loadMyProducer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.loadMyProducer),
      exhaustMap(() =>
        this.repService.repGetMyProducer().pipe(
          map((producer) => RepActions.loadMyProducerSuccess({ producer })),
          catchError(() => of(RepActions.loadMyProducerFailure())),
        ),
      ),
    ),
  );

  saveMyProducer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.saveMyProducer),
      exhaustMap(({ data }) =>
        this.repService.repUpsertMyProducer(data).pipe(
          tap(() => this.notif.success('Datos del productor guardados correctamente.')),
          map((producer) => RepActions.saveMyProducerSuccess({ producer })),
          catchError((err) =>
            of(RepActions.saveMyProducerFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  loadAllProducers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RepActions.loadAllProducers),
      exhaustMap(({ skip, limit }) =>
        this.repService.repListAllProducers(skip ?? 0, limit ?? 100).pipe(
          map((res) => {
            const r = res as { items?: unknown[]; total?: number };
            return RepActions.loadAllProducersSuccess({
              items: (r.items ?? []) as ProducerRead[],
              total: r.total ?? 0,
            });
          }),
          catchError(() => of(RepActions.loadAllProducersFailure())),
        ),
      ),
    ),
  );

}