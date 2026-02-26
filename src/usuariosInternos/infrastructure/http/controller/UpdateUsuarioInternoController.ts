import { Request, Response } from 'express';
import { UpdateUsuarioInterno } from '../../../application/usecase/UpdateUsuarioInterno';

export class UpdateUsuarioInternoController {
  constructor(private readonly updateUsuarioInterno: UpdateUsuarioInterno) {}

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

      const { nombre, email, id_rol, is_active } = req.body;

      if (nombre === undefined && email === undefined && id_rol === undefined && is_active === undefined) {
        res.status(400).json({
          success: false,
          error: 'Debe proporcionar al menos un campo para actualizar',
        });
        return;
      }

      const result = await this.updateUsuarioInterno.execute(id_usuario, {
        nombre,
        email,
        id_rol,
        is_active,
      });

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
