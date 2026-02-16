import { Request, Response, NextFunction } from 'express';
import { DeleteFile } from '../../../application/usecase/DeleteFile';

export const deleteFileController = (deleteFile: DeleteFile) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Eliminar archivo
    await deleteFile.execute(id);

    return res.status(204).send();
  } catch (error: any) {
    if (error.message === 'Archivo no encontrado') {
      return res.status(404).json({
        error: {
          status: '404',
          title: 'Not Found',
          detail: error.message,
        },
      });
    }
    next(error);
  }
};
