import { Request, Response, NextFunction } from 'express';

/**
 * Middleware simple para logging de peticiones HTTP
 * Imprime información básica de cada petición
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
};

