import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser } from '../../domain/model/InternalUser';

export interface GetUsuariosInternosResult {
  success: boolean;
  data?: InternalUser[];
  error?: string;
}

export class GetUsuariosInternos {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(filters?: {
    id_rol?: number;
    is_active?: boolean;
    search?: string;
  }): Promise<GetUsuariosInternosResult> {
    try {
      const usuarios = await this.repository.getUsers(filters);

      return {
        success: true,
        data: usuarios,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
