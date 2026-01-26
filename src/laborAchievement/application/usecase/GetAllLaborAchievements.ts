import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';

export class GetAllLaborAchievements {
  constructor(private repo: LaborAchievementRepository) {}
  async execute() {
    return this.repo.findAll();
  }
}
