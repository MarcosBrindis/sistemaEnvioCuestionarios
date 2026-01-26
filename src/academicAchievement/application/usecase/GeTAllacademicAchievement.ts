import { AcademicAchievementRepository } from "../../domain/port/academicAchievementRepository";

export class GeTAllacademicAchievement {
  constructor(private repo: AcademicAchievementRepository) {}
  async execute() {
    return this.repo.findAll();
  }
}