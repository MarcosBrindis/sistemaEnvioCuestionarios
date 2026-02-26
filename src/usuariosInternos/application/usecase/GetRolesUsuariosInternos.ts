import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface RoleItem {
  id_rol: number;
  nombre: string;
}

export interface GetRolesUsuariosInternosResult {
  success: boolean;
  data?: RoleItem[];
  error?: string;
}

export class GetRolesUsuariosInternos {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(): Promise<GetRolesUsuariosInternosResult> {
    try {
      const roles = await this.repository.getRoles();
      return {
        success: true,
        data: roles,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
