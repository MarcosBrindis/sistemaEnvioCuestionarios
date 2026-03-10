import { NextFunction, Request, Response } from 'express';
import { MysqlConnection } from '../db/mysl/connection';
import { SessionRole } from '../../auth/domain/model/session';

type InternalRole = Exclude<SessionRole, 'egresado'>;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  return next();
}

export function requireRoles(roles: SessionRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!roles.includes(user.rol)) {
      return res.status(403).json({ error: 'No autorizado para este recurso' });
    }

    return next();
  };
}

export function requireSelfOrRoles(paramName: string, roles: InternalRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.session?.user;
    if (!user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const targetId = Number(req.params[paramName]);
    if (Number.isNaN(targetId)) {
      return res.status(400).json({ error: `Parámetro ${paramName} inválido` });
    }

    if (user.rol === 'egresado') {
      if (user.id !== targetId) {
        return res.status(403).json({ error: 'No autorizado para este recurso' });
      }
      return next();
    }

    if (!roles.includes(user.rol as InternalRole)) {
      return res.status(403).json({ error: 'No autorizado para este recurso' });
    }

    return next();
  };
}

export async function getDirectorProgramIds(idUsuarioInterno: number): Promise<number[]> {
  const [rows]: any = await MysqlConnection.execute(
    `
      SELECT id_programa_educativo
      FROM usuario_programa_educativo
      WHERE id_usuario = ?
    `,
    [idUsuarioInterno]
  );

  return rows.map((row: { id_programa_educativo: number }) => row.id_programa_educativo);
}

export function requireProgramScopeOnEgresadoParam(paramName: string = 'id') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.session?.user;
      if (!user) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      if (user.rol !== 'director_programa_educativo') {
        return next();
      }

      const idEgresado = Number(req.params[paramName]);
      if (Number.isNaN(idEgresado)) {
        return res.status(400).json({ error: `Parámetro ${paramName} inválido` });
      }

      const [egresadoRows]: any = await MysqlConnection.execute(
        `SELECT id_programa_educativo FROM egresado WHERE id_egresado = ? LIMIT 1`,
        [idEgresado]
      );

      if (egresadoRows.length === 0) {
        return res.status(404).json({ error: 'Egresado no encontrado' });
      }

      const idPrograma = egresadoRows[0].id_programa_educativo;
      if (!idPrograma) {
        return res.status(403).json({ error: 'No autorizado para este recurso' });
      }

      const [scopeRows]: any = await MysqlConnection.execute(
        `
          SELECT 1
          FROM usuario_programa_educativo
          WHERE id_usuario = ? AND id_programa_educativo = ?
          LIMIT 1
        `,
        [user.id, idPrograma]
      );

      if (scopeRows.length === 0) {
        return res.status(403).json({ error: 'No autorizado para este recurso' });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
