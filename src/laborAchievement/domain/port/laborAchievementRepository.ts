import { LaborAchievement } from '../model/laborAchievement';

export interface LaborAchievementRepository {
  create(idEgresado: number, data: Omit<LaborAchievement, 'id_labor_achievement'>): Promise<LaborAchievement>;
  findAllByEgresado(idEgresado: number): Promise<LaborAchievement[]>;
  findAll(): Promise<LaborAchievement[]>;
  findAllWithEgresadoId(): Promise<Array<LaborAchievement & { id_egresado: number }>>;
  findById(idEgresado: number, idAchievement: number): Promise<LaborAchievement | null>;
  update(idEgresado: number, idAchievement: number, data: Partial<LaborAchievement>): Promise<LaborAchievement | null>;
  delete(idEgresado: number, idAchievement: number): Promise<void>;
}
