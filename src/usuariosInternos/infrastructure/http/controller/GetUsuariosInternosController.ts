import { Request, Response } from 'express';
import { GetUsuariosInternos } from '../../../application/usecase/GetUsuariosInternos';

export class GetUsuariosInternosController {
  constructor(private readonly getUsuariosInternos: GetUsuariosInternos) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id_rol, is_active, search } = req.query;

      const filters: any = {};
      if (id_rol !== undefined) filters.id_rol = parseInt(id_rol as string);
      if (is_active !== undefined) filters.is_active = is_active === 'true';
      if (search) filters.search = search as string;

      const result = await this.getUsuariosInternos.execute(filters);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json({
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
