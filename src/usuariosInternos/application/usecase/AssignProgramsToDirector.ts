import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface AssignProgramsResult {
  success: boolean;
  error?: string;
}

export class AssignProgramsToDirector {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number, id_programas: number[]): Promise<AssignProgramsResult> {
    try {
      if (id_programas.length === 0) {
        return {
          success: false,
          error: 'Debe asignar al menos un programa',
        };
      }

      if (id_programas.length !== 1) {
        return {
          success: false,
          error: 'Un director de programa educativo solo puede tener un programa asignado',
        };
      }

      const assigned = await this.repository.assignPrograms(id_usuario, id_programas);

      if (!assigned) {
        return {
          success: false,
          error: 'No se pudo asignar los programas',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
