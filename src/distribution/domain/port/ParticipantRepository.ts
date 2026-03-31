import { Participant } from '../model/Participant';

export type ParticipantFilter = 'todos' | 'pendientes' | 'contestadas';

export type BirthdayTestTargets = {
  egresadoIds?: number[];
  emails?: string[];
};

export interface ParticipantRepository {
  findBySurvey(id_encuesta: number, filtro: ParticipantFilter): Promise<Participant[]>;
  findBirthdayCelebrants(referenceDate: Date): Promise<Participant[]>;
  findBirthdayTestTargets(targets: BirthdayTestTargets): Promise<Participant[]>;
}
