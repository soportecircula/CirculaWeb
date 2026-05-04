import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ContactService } from '../../../client/services';
import { getApiErrorDetail } from '../../core/notifications/messages';
import { NotificationService } from '../../core/notifications/notification.service';
import * as ContactActions from './contact.actions';

@Injectable()
export class ContactEffects {
  private readonly actions$ = inject(Actions);
  private readonly contactService = inject(ContactService);
  private readonly notif = inject(NotificationService);

  // Requests

  loadRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.loadRequests),
      exhaustMap(() =>
        this.contactService.contactListRequest().pipe(
          map((res) => ContactActions.loadRequestsSuccess({ items: res.items })),
          catchError((err) =>
            of(ContactActions.loadRequestsFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  loadRequestsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactActions.loadRequestsFailure),
        tap(({ error }) => this.notif.error(error)),
      ),
    { dispatch: false },
  );

  approveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.approveRequest),
      mergeMap(({ id }) =>
        this.contactService.contactApproveRequest(id).pipe(
          tap(() => this.notif.success('Solicitud aprobada correctamente.')),
          map((updated) => ContactActions.approveRequestSuccess({ updated })),
          catchError((err) =>
            of(ContactActions.approveRequestFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  approveRequestFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactActions.approveRequestFailure),
        tap(({ error }) => this.notif.error(error)),
      ),
    { dispatch: false },
  );

  rejectRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.rejectRequest),
      mergeMap(({ id, note }) =>
        this.contactService.contactRejectRequest(id, { note }).pipe(
          tap(() => this.notif.success('Solicitud rechazada.')),
          map((updated) => ContactActions.rejectRequestSuccess({ updated })),
          catchError((err) =>
            of(ContactActions.rejectRequestFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  rejectRequestFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactActions.rejectRequestFailure),
        tap(({ error }) => this.notif.error(error)),
      ),
    { dispatch: false },
  );

  sendInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.sendInvite),
      mergeMap(({ id }) =>
        this.contactService.contactSendInvite(id).pipe(
          tap(() => this.notif.success('Invitación enviada correctamente.')),
          map((updated) => ContactActions.sendInviteSuccess({ updated })),
          catchError((err) =>
            of(ContactActions.sendInviteFailure({ error: getApiErrorDetail(err) })),
          ),
        ),
      ),
    ),
  );

  sendInviteFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContactActions.sendInviteFailure),
        tap(({ error }) => this.notif.error(error)),
      ),
    { dispatch: false },
  );

  // Slots

  loadSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.loadSlots),
      switchMap(({ date, requirementType }) =>
        this.contactService.contactGetSlots(date, requirementType).pipe(
          map((res) => ContactActions.loadSlotsSuccess({ slots: res.slots ?? [] })),
          catchError(() => of(ContactActions.loadSlotsFailure())),
        ),
      ),
    ),
  );

  // Submission

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContactActions.submitForm),
      exhaustMap(({ payload }) =>
        this.contactService.contactSubmitContactForm(payload).pipe(
          map(() => ContactActions.submitFormSuccess()),
          catchError((err) =>
            of(
              ContactActions.submitFormFailure({
                errorMsg: getApiErrorDetail(err),
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
