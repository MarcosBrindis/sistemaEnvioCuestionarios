import { Request, Response } from 'express';
import { ResetPasswordUsuarioInterno } from '../../../application/usecase/ResetPasswordUsuarioInterno';

export class ResetPasswordController {
  constructor(private readonly resetPassword: ResetPasswordUsuarioInterno) {}

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

      const { new_password } = req.body;

      if (!new_password) {
        res.status(400).json({
          success: false,
          error: 'Campo requerido: new_password',
        });
        return;
      }

      const result = await this.resetPassword.execute(id_usuario, new_password);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json({
        success: true,
        message: 'Contraseña restablecida correctamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
