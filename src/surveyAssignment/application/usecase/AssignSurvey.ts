import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class AssignSurvey {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(idEncuesta: number, egresados: number[]): Promise<{ created: number; reactivated: number; skipped: number }> {
    return this.assignmentRepo.assignToGraduates(idEncuesta, egresados);
  }
}
