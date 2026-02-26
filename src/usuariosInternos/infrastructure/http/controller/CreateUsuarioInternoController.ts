import { Request, Response } from 'express';
import { CreateUsuarioInterno } from '../../../application/usecase/CreateUsuarioInterno';

export class CreateUsuarioInternoController {
  constructor(private readonly createUsuarioInterno: CreateUsuarioInterno) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, email, password, id_rol } = req.body;

      if (!nombre || !email || !password || !id_rol) {
        res.status(400).json({
          success: false,
          error: 'Faltan campos requeridos: nombre, email, password, id_rol',
        });
        return;
      }

      const result = await this.createUsuarioInterno.execute({
        nombre,
        email,
        password,
        id_rol,
      });

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(201).json({
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
