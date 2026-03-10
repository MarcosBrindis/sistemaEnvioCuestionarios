import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';

export interface GetUserProgramsResult {
  success: boolean;
  data?: Array<{
    id_programa: number;
    nombre_programa: string;
  }>;
  error?: string;
}

export class GetUserPrograms {
  constructor(private readonly repository: IUsuariosInternosRepository) {}

  async execute(id_usuario: number): Promise<GetUserProgramsResult> {
    try {
      const programs = await this.repository.getUserPrograms(id_usuario);

      return {
        success: true,
        data: programs,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}
