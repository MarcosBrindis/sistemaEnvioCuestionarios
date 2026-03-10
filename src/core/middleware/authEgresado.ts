import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que valida que el usuario esté autenticado.
 * Permite acceso solo si req.session.user existe.
 */
export function authEgresado(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  if (req.session.user.rol !== 'egresado') {
    return res.status(403).json({ error: 'No autorizado para este recurso' });
  }

  next();
}
