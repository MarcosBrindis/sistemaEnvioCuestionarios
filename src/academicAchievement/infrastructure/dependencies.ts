import { AcademicAchievementRepositoryMySQL } from './database/mysql/AcademicAchievementRepositoryMySQL';
import { AcademicAchievementRepository } from '../domain/port/academicAchievementRepository';

export const academicAchievementRepository: AcademicAchievementRepository = new AcademicAchievementRepositoryMySQL();

export const dependencies = {
  academicAchievementRepository,
};
