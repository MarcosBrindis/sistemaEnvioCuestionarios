import { AcademicAchievementRepository } from '../../domain/port/academicAchievementRepository';

export class GetAcademicAchievementById {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number) {
    return this.repo.findById(idEgresado, idAchievement);
  }
}
