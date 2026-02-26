import { Request, Response } from 'express';
import { GetUsuarioInternoById } from '../../../application/usecase/GetUsuarioInternoById';

export class GetUsuarioInternoByIdController {
  constructor(private readonly getUsuarioInternoById: GetUsuarioInternoById) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const id_usuario = parseInt(id);

      if (isNaN(id_usuario)) {
        res.status(400).json({
          success: false,
          error: 'ID de usuario inválido',
        });
        return;
      }

      const result = await this.getUsuarioInternoById.execute(id_usuario);

      if (!result.success) {
        res.status(404).json(result);
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
