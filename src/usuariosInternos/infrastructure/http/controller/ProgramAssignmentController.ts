import { Request, Response } from 'express';
import { AssignProgramsToDirector } from '../../../application/usecase/AssignProgramsToDirector';
import { GetUserPrograms } from '../../../application/usecase/GetUserPrograms';
import { RemoveUserProgram } from '../../../application/usecase/RemoveUserProgram';

export class ProgramAssignmentController {
  constructor(
    private readonly assignPrograms: AssignProgramsToDirector,
    private readonly getUserPrograms: GetUserPrograms,
    private readonly removeUserProgram: RemoveUserProgram
  ) {}

  async assignProgramsHandle(req: Request, res: Response): Promise<void> {
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

      const { id_programas } = req.body;

      if (!Array.isArray(id_programas)) {
        res.status(400).json({
          success: false,
          error: 'id_programas debe ser un array',
        });
        return;
      }

      if (id_programas.length !== 1) {
        res.status(400).json({
          success: false,
          error: 'Un director de programa educativo solo puede tener un programa asignado',
        });
        return;
      }

      const result = await this.assignPrograms.execute(id_usuario, id_programas);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json({
        success: true,
        message: 'Programas asignados correctamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async getProgramsHandle(req: Request, res: Response): Promise<void> {
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

      const result = await this.getUserPrograms.execute(id_usuario);

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

  async removeProgramHandle(req: Request, res: Response): Promise<void> {
    try {
      const { id, idPrograma } = req.params;
      const id_usuario = parseInt(id);
      const id_programa = parseInt(idPrograma);

      if (isNaN(id_usuario) || isNaN(id_programa)) {
        res.status(400).json({
          success: false,
          error: 'IDs inválidos',
        });
        return;
      }

      const result = await this.removeUserProgram.execute(id_usuario, id_programa);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.json({
        success: true,
        message: 'Programa removido correctamente',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
}
