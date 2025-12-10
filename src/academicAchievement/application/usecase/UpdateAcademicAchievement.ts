import { AcademicAchievementRepository } from '../../domain/port/academicAchievementRepository';
import { AcademicAchievement } from '../../domain/model/academicAchievement';

export class UpdateAcademicAchievement {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number, data: Partial<AcademicAchievement>) {
    return this.repo.update(idEgresado, idAchievement, data);
  }
}
