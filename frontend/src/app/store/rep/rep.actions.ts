import { createAction, props } from '@ngrx/store';
import { NormativeObligationRead, ProducerRead, ProducerUpsert, SectorRead } from '../../../client/models';

// Obligations
export const loadObligations = createAction('[Rep] Load Obligations');
export const loadObligationsSuccess = createAction(
  '[Rep] Load Obligations Success',
  props<{ obligations: NormativeObligationRead[] }>(),
);
export const loadObligationsFailure = createAction('[Rep] Load Obligations Failure');

// Sectors
export const loadSectors = createAction('[Rep] Load Sectors');
export const loadSectorsSuccess = createAction(
  '[Rep] Load Sectors Success',
  props<{ sectors: SectorRead[] }>(),
);
export const loadSectorsFailure = createAction('[Rep] Load Sectors Failure');

// Producer (propio)
export const loadMyProducer = createAction('[Rep] Load My Producer');
export const loadMyProducerSuccess = createAction(
  '[Rep] Load My Producer Success',
  props<{ producer: ProducerRead | null }>(),
);
export const loadMyProducerFailure = createAction('[Rep] Load My Producer Failure');

export const saveMyProducer = createAction(
  '[Rep] Save My Producer',
  props<{ data: ProducerUpsert }>(),
);
export const saveMyProducerSuccess = createAction(
  '[Rep] Save My Producer Success',
  props<{ producer: ProducerRead }>(),
);
export const saveMyProducerFailure = createAction(
  '[Rep] Save My Producer Failure',
  props<{ error: string }>(),
);
export const clearProducerError = createAction('[Rep] Clear Producer Error');

// My producers (multi-producer list)
export const loadMyProducers = createAction('[Rep] Load My Producers');
export const loadMyProducersSuccess = createAction(
  '[Rep] Load My Producers Success',
  props<{ producers: ProducerRead[] }>(),
);
export const loadMyProducersFailure = createAction('[Rep] Load My Producers Failure');

export const addProducer = createAction(
  '[Rep] Add Producer',
  props<{ data: ProducerUpsert }>(),
);
export const addProducerSuccess = createAction(
  '[Rep] Add Producer Success',
  props<{ producer: ProducerRead }>(),
);
export const addProducerFailure = createAction(
  '[Rep] Add Producer Failure',
  props<{ error: string }>(),
);

export const updateProducerById = createAction(
  '[Rep] Update Producer By Id',
  props<{ id: string; data: ProducerUpsert }>(),
);
export const updateProducerByIdSuccess = createAction(
  '[Rep] Update Producer By Id Success',
  props<{ producer: ProducerRead }>(),
);
export const updateProducerByIdFailure = createAction(
  '[Rep] Update Producer By Id Failure',
  props<{ error: string }>(),
);

// Admin: listado de productores
export const loadAllProducers = createAction(
  '[Rep] Load All Producers',
  props<{ skip?: number; limit?: number }>(),
);
export const loadAllProducersSuccess = createAction(
  '[Rep] Load All Producers Success',
  props<{ items: ProducerRead[]; total: number }>(),
);
export const loadAllProducersFailure = createAction('[Rep] Load All Producers Failure');