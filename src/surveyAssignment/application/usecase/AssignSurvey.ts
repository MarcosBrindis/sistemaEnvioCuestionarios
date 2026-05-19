import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class AssignSurvey {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(idEncuesta: number, egresados: number[]): Promise<{ created: number; reactivated: number; skipped: number }> {
    // Mantener historial, pero asegurar que solo los miembros recién asignados queden activos
    await this.assignmentRepo.deactivateAllAssignmentsForSurvey(idEncuesta);
    return this.assignmentRepo.assignToGraduates(idEncuesta, egresados);
  }
}
