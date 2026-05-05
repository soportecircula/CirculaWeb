import { createReducer, on } from '@ngrx/store';
import { RepState } from './rep.models';
import * as RepActions from './rep.actions';

export const initialState: RepState = {
  sectors: [],
  sectorsLoading: false,
  obligations: [],
  obligationsLoading: false,
  myProducers: [],
  myProducersLoading: false,
  producerSavingError: null,
  producer: null,
  producerLoading: false,
  producerSaving: false,
  producerError: null,
  allProducers: [],
  allProducersTotal: 0,
  allProducersLoading: false,
};

export const repReducer = createReducer(
  initialState,

  on(RepActions.loadObligations, (state) => ({ ...state, obligationsLoading: true })),
  on(RepActions.loadObligationsSuccess, (state, { obligations }) => ({
    ...state, obligations, obligationsLoading: false,
  })),
  on(RepActions.loadObligationsFailure, (state) => ({ ...state, obligationsLoading: false })),

  on(RepActions.loadSectors, (state) => ({ ...state, sectorsLoading: true })),
  on(RepActions.loadSectorsSuccess, (state, { sectors }) => ({
    ...state, sectors, sectorsLoading: false,
  })),
  on(RepActions.loadSectorsFailure, (state) => ({ ...state, sectorsLoading: false })),

  on(RepActions.loadMyProducer, (state) => ({ ...state, producerLoading: true })),
  on(RepActions.loadMyProducerSuccess, (state, { producer }) => ({
    ...state, producer, producerLoading: false,
  })),
  on(RepActions.loadMyProducerFailure, (state) => ({ ...state, producerLoading: false })),

  on(RepActions.saveMyProducer, (state) => ({
    ...state, producerSaving: true, producerError: null,
  })),
  on(RepActions.saveMyProducerSuccess, (state, { producer }) => ({
    ...state, producer, producerSaving: false, producerError: null,
  })),
  on(RepActions.saveMyProducerFailure, (state, { error }) => ({
    ...state, producerSaving: false, producerError: error,
  })),
  on(RepActions.clearProducerError, (state) => ({ ...state, producerError: null })),

  on(RepActions.loadMyProducers, (state) => ({ ...state, myProducersLoading: true })),
  on(RepActions.loadMyProducersSuccess, (state, { producers }) => ({
    ...state, myProducers: producers, myProducersLoading: false,
  })),
  on(RepActions.loadMyProducersFailure, (state) => ({ ...state, myProducersLoading: false })),

  on(RepActions.addProducer, (state) => ({
    ...state, producerSaving: true, producerSavingError: null,
  })),
  on(RepActions.addProducerSuccess, (state, { producer }) => ({
    ...state,
    producerSaving: false,
    myProducers: [...state.myProducers, producer],
  })),
  on(RepActions.addProducerFailure, (state, { error }) => ({
    ...state, producerSaving: false, producerSavingError: error,
  })),

  on(RepActions.updateProducerById, (state) => ({
    ...state, producerSaving: true, producerSavingError: null,
  })),
  on(RepActions.updateProducerByIdSuccess, (state, { producer }) => ({
    ...state,
    producerSaving: false,
    myProducers: state.myProducers.map((p) => p.id === producer.id ? producer : p),
  })),
  on(RepActions.updateProducerByIdFailure, (state, { error }) => ({
    ...state, producerSaving: false, producerSavingError: error,
  })),

  on(RepActions.loadAllProducers, (state) => ({ ...state, allProducersLoading: true })),
  on(RepActions.loadAllProducersSuccess, (state, { items, total }) => ({
    ...state,
    allProducers: items,
    allProducersTotal: total,
    allProducersLoading: false,
  })),
  on(RepActions.loadAllProducersFailure, (state) => ({ ...state, allProducersLoading: false })),
);