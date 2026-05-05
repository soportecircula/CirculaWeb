import { NormativeObligationRead, ProducerRead, SectorRead } from '../../../client/models';

export interface RepState {
  sectors: SectorRead[];
  sectorsLoading: boolean;
  obligations: NormativeObligationRead[];
  obligationsLoading: boolean;
  myProducers: ProducerRead[];
  myProducersLoading: boolean;
  producerSavingError: string | null;
  producer: ProducerRead | null;
  producerLoading: boolean;
  producerSaving: boolean;
  producerError: string | null;
  /** Lista admin (GET /rep/admin/producers); vacío si no aplica. */
  allProducers: ProducerRead[];
  allProducersTotal: number;
  allProducersLoading: boolean;
}