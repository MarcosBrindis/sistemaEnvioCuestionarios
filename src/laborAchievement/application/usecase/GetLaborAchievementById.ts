import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';

export class GetLaborAchievementById {
  constructor(private repo: LaborAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number) {
    return this.repo.findById(idEgresado, idAchievement);
  }
}
