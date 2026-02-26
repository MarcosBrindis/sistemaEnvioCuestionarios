import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser } from '../../domain/model/InternalUser';

export interface GetUsuarioInternoByIdResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
}

export class GetUsuarioInternoById {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number): Promise<GetUsuarioInternoByIdResult> {
    try {
      const usuario = await this.repository.getUserById(id_usuario);

      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado',
        };
      }

      return {
        success: true,
        data: usuario,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
