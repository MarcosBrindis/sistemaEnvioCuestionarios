import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';
import { LaborAchievement } from '../../domain/model/laborAchievement';

export class UpdateLaborAchievement {
  constructor(private repo: LaborAchievementRepository) {}
  async execute(idEgresado: number, idAchievement: number, data: Partial<LaborAchievement>) {
    return this.repo.update(idEgresado, idAchievement, data);
  }
}
