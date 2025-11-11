import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para manejo de errores HTTP
 * Funciones específicas para cada tipo de operación
 */

/**
 * Maneja errores en operaciones GET
 */
export const handleGetError = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error en GET:', err.message);
  
  res.status(404).json({
    error: {
      status: '404',
      title: 'Resource Not Found',
      detail: err.message
    }
  });
};

/**
 * Maneja errores en operaciones POST (crear)
 */
export const handlePostError = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error en POST:', err.message);
  
  res.status(400).json({
    error: {
      status: '400',
      title: 'Bad Request',
      detail: err.message
    }
  });
};

/**
 * Maneja errores en operaciones PUT/PATCH (actualizar)
 */
export const handleUpdateError = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error en UPDATE:', err.message);
  
  res.status(400).json({
    error: {
      status: '400',
      title: 'Bad Request', 
      detail: err.message
    }
  });
};

/**
 * Maneja errores en operaciones DELETE
 */
export const handleDeleteError = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error en DELETE:', err.message);
  
  res.status(400).json({
    error: {
      status: '400',
      title: 'Bad Request',
      detail: err.message
    }
  });
};

/**
 * Manejador de errores genérico (para usar como fallback)
 */
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Error:', err.message);
  
  res.status(500).json({
    error: {
      status: '500',
      title: 'Internal Server Error',
      detail: err.message
    }
  });
};

