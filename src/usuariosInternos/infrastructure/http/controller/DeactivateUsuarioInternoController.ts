import { Request, Response } from 'express';
import { DeactivateUsuarioInterno } from '../../../application/usecase/DeactivateUsuarioInterno';

export class DeactivateUsuarioInternoController {
  constructor(private readonly deactivateUsuarioInterno: DeactivateUsuarioInterno) {}

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

      const result = await this.deactivateUsuarioInterno.execute(id_usuario);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json({
        success: true,
        message: 'Usuario desactivado correctamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
