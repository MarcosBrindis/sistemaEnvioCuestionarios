import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';
import { LaborAchievement } from '../../domain/model/laborAchievement';

export class CreateLaborAchievement {
  constructor(private repo: LaborAchievementRepository) {}
  async execute(idEgresado: number, data: Omit<LaborAchievement, 'id_labor_achievement'>): Promise<LaborAchievement> {
    return this.repo.create(idEgresado, data);
  }
}
