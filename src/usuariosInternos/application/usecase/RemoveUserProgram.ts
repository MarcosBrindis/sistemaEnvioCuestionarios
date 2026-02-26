import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface RemoveUserProgramResult {
  success: boolean;
  error?: string;
}

export class RemoveUserProgram {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number, id_programa: number): Promise<RemoveUserProgramResult> {
    try {
      const removed = await this.repository.unassignProgram(id_usuario, id_programa);

      if (!removed) {
        return {
          success: false,
          error: 'No se pudo remover la asignación del programa',
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
