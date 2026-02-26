import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface DeactivateUsuarioInternoResult {
  success: boolean;
  error?: string;
}

export class DeactivateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number): Promise<DeactivateUsuarioInternoResult> {
    try {
      const deactivated = await this.repository.deactivateUser(id_usuario);

      if (!deactivated) {
        return {
          success: false,
          error: 'No se pudo desactivar el usuario',
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
