import { createReducer, on } from '@ngrx/store';
import { ContactState } from './contact.models';
import * as ContactActions from './contact.actions';

export const initialState: ContactState = {
  requests: {
    items: [],
    loading: false,
    processingId: null,
  },
  slots: {
    slots: [],
    loading: false,
    date: null,
    requirementType: null,
  },
  submission: {
    loading: false,
    success: false,
    errorMsg: null,
  },
};

export const contactReducer = createReducer(
  initialState,

  // Requests
  on(ContactActions.loadRequests, (state) => ({
    ...state,
    requests: { ...state.requests, loading: true },
  })),
  on(ContactActions.loadRequestsSuccess, (state, { items }) => ({
    ...state,
    requests: { items, loading: false, processingId: null },
  })),
  on(ContactActions.loadRequestsFailure, (state) => ({
    ...state,
    requests: { ...state.requests, loading: false },
  })),

  on(ContactActions.approveRequest, (state, { id }) => ({
    ...state,
    requests: { ...state.requests, processingId: id },
  })),
  on(ContactActions.approveRequestSuccess, (state, { updated }) => ({
    ...state,
    requests: {
      ...state.requests,
      items: state.requests.items.map((item) => (item.id === updated.id ? updated : item)),
      processingId: null,
    },
  })),
  on(ContactActions.approveRequestFailure, (state) => ({
    ...state,
    requests: { ...state.requests, processingId: null },
  })),

  on(ContactActions.rejectRequest, (state, { id }) => ({
    ...state,
    requests: { ...state.requests, processingId: id },
  })),
  on(ContactActions.rejectRequestSuccess, (state, { updated }) => ({
    ...state,
    requests: {
      ...state.requests,
      items: state.requests.items.map((item) => (item.id === updated.id ? updated : item)),
      processingId: null,
    },
  })),
  on(ContactActions.rejectRequestFailure, (state) => ({
    ...state,
    requests: { ...state.requests, processingId: null },
  })),

  on(ContactActions.sendInvite, (state, { id }) => ({
    ...state,
    requests: { ...state.requests, processingId: id },
  })),
  on(ContactActions.sendInviteSuccess, (state, { updated }) => ({
    ...state,
    requests: {
      ...state.requests,
      items: state.requests.items.map((item) => (item.id === updated.id ? updated : item)),
      processingId: null,
    },
  })),
  on(ContactActions.sendInviteFailure, (state) => ({
    ...state,
    requests: { ...state.requests, processingId: null },
  })),

  // Slots
  on(ContactActions.loadSlots, (state, { date, requirementType }) => ({
    ...state,
    slots: { ...state.slots, loading: true, date, requirementType, slots: [] },
  })),
  on(ContactActions.loadSlotsSuccess, (state, { slots }) => ({
    ...state,
    slots: { ...state.slots, slots, loading: false },
  })),
  on(ContactActions.loadSlotsFailure, (state) => ({
    ...state,
    slots: { ...state.slots, slots: [], loading: false },
  })),
  on(ContactActions.clearSlots, (state) => ({
    ...state,
    slots: initialState.slots,
  })),

  // Submission
  on(ContactActions.submitForm, (state) => ({
    ...state,
    submission: { loading: true, success: false, errorMsg: null },
  })),
  on(ContactActions.submitFormSuccess, (state) => ({
    ...state,
    submission: { loading: false, success: true, errorMsg: null },
  })),
  on(ContactActions.submitFormFailure, (state, { errorMsg }) => ({
    ...state,
    submission: { loading: false, success: false, errorMsg },
  })),
  on(ContactActions.resetSubmission, (state) => ({
    ...state,
    submission: initialState.submission,
  })),
);
