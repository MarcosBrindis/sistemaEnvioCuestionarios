import { AcademicAchievementRepository } from '../../domain/port/academicAchievementRepository';
import { AcademicAchievement } from '../../domain/model/academicAchievement';

export class CreateAcademicAchievement {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute(idEgresado: number, data: Omit<AcademicAchievement, 'id_academic_achievement'>): Promise<AcademicAchievement> {
    return this.repo.create(idEgresado, data);
  }
}
