import bcrypt from 'bcrypt';
import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

export class ResetPasswordUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number, new_password: string): Promise<ResetPasswordResult> {
    try {
      this.validatePassword(new_password);

      const password_hash = await bcrypt.hash(new_password, 10);

      const updated = await this.repository.changePassword(id_usuario, password_hash);

      if (!updated) {
        return {
          success: false,
          error: 'No se pudo cambiar la contraseña',
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
