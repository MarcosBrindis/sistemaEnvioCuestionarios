import { Participant } from '../model/Participant';

export type ParticipantFilter = 'todos' | 'pendientes' | 'contestadas';

export interface ParticipantRepository {
  findBySurvey(id_encuesta: number, filtro: ParticipantFilter): Promise<Participant[]>;
}
