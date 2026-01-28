import { AcademicAchievement } from '../model/academicAchievement';

export interface AcademicAchievementRepository {
  create(idEgresado: number, data: Omit<AcademicAchievement, 'id_academic_achievement'>): Promise<AcademicAchievement>;
  findAllByEgresado(idEgresado: number): Promise<AcademicAchievement[]>;
  findAll(): Promise<AcademicAchievement[]>;
  findAllWithEgresadoId(): Promise<Array<AcademicAchievement & { id_egresado: number }>>;
  findById(idEgresado: number, idAchievement: number): Promise<AcademicAchievement | null>;
  update(idEgresado: number, idAchievement: number, data: Partial<AcademicAchievement>): Promise<AcademicAchievement | null>;
  delete(idEgresado: number, idAchievement: number): Promise<void>;
}
