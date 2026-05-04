import { AvailableSlot, ContactRequestRead } from '../../../client/models';

export interface ContactRequestsState {
  items: ContactRequestRead[];
  loading: boolean;
  processingId: number | null;
}

export interface ContactSlotsState {
  slots: AvailableSlot[];
  loading: boolean;
  date: string | null;
  requirementType: string | null;
}

export interface ContactSubmissionState {
  loading: boolean;
  success: boolean;
  errorMsg: string | null;
}

export interface ContactState {
  requests: ContactRequestsState;
  slots: ContactSlotsState;
  submission: ContactSubmissionState;
}
