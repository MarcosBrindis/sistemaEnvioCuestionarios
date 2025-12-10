import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';

export class DeleteLaborAchievement {
  constructor(private repo: LaborAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number) {
    return this.repo.delete(idEgresado, idAchievement);
  }
}
