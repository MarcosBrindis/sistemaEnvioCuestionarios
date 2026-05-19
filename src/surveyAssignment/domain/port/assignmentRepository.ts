
export interface AssignmentRepository {
  assignToGraduates(
    idEncuesta: number,
    egresados: number[]
  ): Promise<{ created: number; reactivated: number; skipped: number }>;

  deactivateAllAssignmentsForSurvey(idEncuesta: number): Promise<void>;

  listParticipants(
    idEncuesta: number,
    options: {
      page: number;
      limit: number;
      filtro_acceso?: 'activos' | 'revocados' | 'todos';
      estado_respuesta?: 'pendiente' | 'contestada';
      busqueda?: string;
    }
  ): Promise<{ meta: any; data: any[] }>;

  revokeAccess(uuid: string): Promise<void>;

  getGroupsAssignedToSurvey(idEncuesta: number): Promise<any[]>;
}
