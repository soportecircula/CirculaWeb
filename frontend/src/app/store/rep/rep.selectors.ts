import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RepState } from './rep.models';

export const selectRepState = createFeatureSelector<RepState>('rep');

export const selectObligations        = createSelector(selectRepState, (s) => s.obligations);
export const selectObligationsLoading = createSelector(selectRepState, (s) => s.obligationsLoading);

export const selectSectors        = createSelector(selectRepState, (s) => s.sectors);
export const selectSectorsLoading = createSelector(selectRepState, (s) => s.sectorsLoading);
export const selectMyProducer     = createSelector(selectRepState, (s) => s.producer);
export const selectProducerLoading = createSelector(selectRepState, (s) => s.producerLoading);
export const selectProducerSaving  = createSelector(selectRepState, (s) => s.producerSaving);
export const selectProducerError   = createSelector(selectRepState, (s) => s.producerError);

export const selectMyProducers         = createSelector(selectRepState, (s) => s.myProducers);
export const selectMyProducersLoading  = createSelector(selectRepState, (s) => s.myProducersLoading);
export const selectProducerSavingError = createSelector(selectRepState, (s) => s.producerSavingError);

export const selectAllProducers = createSelector(selectRepState, (s) => s.allProducers);
export const selectAllProducersTotal = createSelector(selectRepState, (s) => s.allProducersTotal);
export const selectAllProducersLoading = createSelector(
  selectRepState,
  (s) => s.allProducersLoading,
);