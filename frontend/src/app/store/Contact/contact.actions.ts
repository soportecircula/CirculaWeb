import { createAction, props } from '@ngrx/store';
import { AvailableSlot, ContactFormRequest, ContactRequestRead } from '../../../client/models';

// Requests
export const loadRequests = createAction('[Contact/Requests] Load Requests');
export const loadRequestsSuccess = createAction(
  '[Contact/Requests] Load Requests Success',
  props<{ items: ContactRequestRead[] }>(),
);
export const loadRequestsFailure = createAction(
  '[Contact/Requests] Load Requests Failure',
  props<{ error: string }>(),
);

export const approveRequest = createAction(
  '[Contact/Requests] Approve Request',
  props<{ id: number }>(),
);
export const approveRequestSuccess = createAction(
  '[Contact/Requests] Approve Request Success',
  props<{ updated: ContactRequestRead }>(),
);
export const approveRequestFailure = createAction(
  '[Contact/Requests] Approve Request Failure',
  props<{ error: string }>(),
);

export const rejectRequest = createAction(
  '[Contact/Requests] Reject Request',
  props<{ id: number; note: string | null }>(),
);
export const rejectRequestSuccess = createAction(
  '[Contact/Requests] Reject Request Success',
  props<{ updated: ContactRequestRead }>(),
);
export const rejectRequestFailure = createAction(
  '[Contact/Requests] Reject Request Failure',
  props<{ error: string }>(),
);

export const sendInvite = createAction(
  '[Contact/Requests] Send Invite',
  props<{ id: number }>(),
);
export const sendInviteSuccess = createAction(
  '[Contact/Requests] Send Invite Success',
  props<{ updated: ContactRequestRead }>(),
);
export const sendInviteFailure = createAction(
  '[Contact/Requests] Send Invite Failure',
  props<{ error: string }>(),
);

// Slots
export const loadSlots = createAction(
  '[Contact/Slots] Load Slots',
  props<{ date: string; requirementType: string }>(),
);
export const loadSlotsSuccess = createAction(
  '[Contact/Slots] Load Slots Success',
  props<{ slots: AvailableSlot[] }>(),
);
export const loadSlotsFailure = createAction('[Contact/Slots] Load Slots Failure');
export const clearSlots = createAction('[Contact/Slots] Clear Slots');

// Submission
export const submitForm = createAction(
  '[Contact/Submission] Submit Form',
  props<{ payload: ContactFormRequest }>(),
);
export const submitFormSuccess = createAction('[Contact/Submission] Submit Form Success');
export const submitFormFailure = createAction(
  '[Contact/Submission] Submit Form Failure',
  props<{ errorMsg: string }>(),
);
export const resetSubmission = createAction('[Contact/Submission] Reset Submission');
