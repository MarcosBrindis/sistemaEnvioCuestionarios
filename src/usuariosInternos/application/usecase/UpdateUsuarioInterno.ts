import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser, UpdateInternalUserInput } from '../../domain/model/InternalUser';

export interface UpdateUsuarioInternoResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
}

export class UpdateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(
    id_usuario: number,
    input: UpdateInternalUserInput
  ): Promise<UpdateUsuarioInternoResult> {
    try {
      const updated = await this.repository.updateUser(id_usuario, input);

      if (!updated) {
        return {
          success: false,
          error: 'No se pudo actualizar el usuario',
        };
      }

      const usuario = await this.repository.getUserById(id_usuario);

      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado después de actualizar',
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
