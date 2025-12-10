import { AcademicAchievementRepository } from '../../domain/port/academicAchievementRepository';

export class DeleteAcademicAchievement {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number) {
    return this.repo.delete(idEgresado, idAchievement);
  }
}
