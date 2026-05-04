import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactState } from './contact.models';

export const selectContactState = createFeatureSelector<ContactState>('contact');

// Requests selectors
export const selectContactRequests = createSelector(
  selectContactState,
  (state) => state.requests,
);
export const selectRequestItems = createSelector(
  selectContactRequests,
  (requests) => requests.items,
);
export const selectRequestsLoading = createSelector(
  selectContactRequests,
  (requests) => requests.loading,
);
export const selectProcessingId = createSelector(
  selectContactRequests,
  (requests) => requests.processingId,
);

// Slots selectors
export const selectContactSlots = createSelector(
  selectContactState,
  (state) => state.slots,
);
export const selectAvailableSlots = createSelector(
  selectContactSlots,
  (slots) => slots.slots,
);
export const selectSlotsLoading = createSelector(
  selectContactSlots,
  (slots) => slots.loading,
);
export const selectSelectedDate = createSelector(
  selectContactSlots,
  (slots) => slots.date,
);

// Submission selectors
export const selectContactSubmission = createSelector(
  selectContactState,
  (state) => state.submission,
);
export const selectSubmissionLoading = createSelector(
  selectContactSubmission,
  (submission) => submission.loading,
);
export const selectSubmissionSuccess = createSelector(
  selectContactSubmission,
  (submission) => submission.success,
);
export const selectSubmissionErrorMsg = createSelector(
  selectContactSubmission,
  (submission) => submission.errorMsg,
);
