import { Request, Response } from 'express';
import { GetRolesUsuariosInternos } from '../../../application/usecase/GetRolesUsuariosInternos';

export class GetRolesUsuariosInternosController {
  constructor(private readonly getRolesUsuariosInternos: GetRolesUsuariosInternos) {}

  async handle(_req: Request, res: Response): Promise<void> {
    try {
      const result = await this.getRolesUsuariosInternos.execute();

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
