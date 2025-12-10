import { LaborAchievementRepositoryMySQL } from './database/mysql/LaborAchievementRepositoryMySQL';
import { LaborAchievementRepository } from '../domain/port/laborAchievementRepository';

export const laborAchievementRepository: LaborAchievementRepository = new LaborAchievementRepositoryMySQL();

export const dependencies = {
  laborAchievementRepository,
};
