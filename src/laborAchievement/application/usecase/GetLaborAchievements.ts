import { LaborAchievementRepository } from '../../domain/port/laborAchievementRepository';

export class GetLaborAchievements {
  constructor(private repo: LaborAchievementRepository) {}
  async execute(idEgresado: number) {
    return this.repo.findAllByEgresado(idEgresado);
  }
}
