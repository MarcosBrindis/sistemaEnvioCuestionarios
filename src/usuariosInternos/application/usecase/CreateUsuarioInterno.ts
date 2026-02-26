import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser, CreateInternalUserInput } from '../../domain/model/InternalUser';

export interface CreateUsuarioInternoResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
}

export class CreateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(input: CreateInternalUserInput): Promise<CreateUsuarioInternoResult> {
    try {
      this.validatePassword(input.password);

      const { id_usuario } = await this.repository.createUser(input);

      const user = await this.repository.getUserById(id_usuario);

      if (!user) {
        return {
          success: false,
          error: 'No se pudo recuperar el usuario creado',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
  }
}
