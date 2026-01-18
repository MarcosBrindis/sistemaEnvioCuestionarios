import { AssignmentRepository } from '../../domain/port/assignmentRepository';
import { MysqlConnection } from '../../../core/db/mysl/connection';

export class AssignSurveyGroup {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(idEncuesta: number, idGroup: number): Promise<{ created: number; reactivated: number; skipped: number }> {
    // Obtener todos los egresados del grupo
    const [rows]: [any[], any] = await MysqlConnection.query(
      'SELECT id_egresado FROM grupo_miembro WHERE id_grupo = ?',
      [idGroup]
    );
    const egresados = rows.map(r => r.id_egresado);
    if (!egresados.length) return { created: 0, reactivated: 0, skipped: 0 };
    return this.assignmentRepo.assignToGraduates(idEncuesta, egresados);
  }
}
