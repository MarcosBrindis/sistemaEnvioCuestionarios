import { AcademicAchievementRepository } from '../../domain/port/academicAchievementRepository';

export class GetAcademicAchievements {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute(idEgresado: number) {
    return this.repo.findAllByEgresado(idEgresado);
  }
}
