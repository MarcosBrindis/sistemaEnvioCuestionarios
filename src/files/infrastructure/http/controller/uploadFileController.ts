import { Request, Response, NextFunction } from 'express';
import { UploadFile } from '../../../application/usecase/UploadFile';

export const uploadFileController = (uploadFile: UploadFile) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: 'No se proporcionó ningún archivo',
        },
      });
    }

    // Obtener ID del usuario autenticado (opcional)
    const uploadedBy = req.session.user?.id;

    // Ejecutar caso de uso
    const fileId = await uploadFile.execute(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      uploadedBy
    );

    // Construir URL de acceso al archivo
    const fileUrl = `${req.protocol}://${req.get('host')}/api/files/${fileId}`;

    return res.status(201).json({
      data: {
        type: 'files',
        id: fileId,
        attributes: {
          original_name: req.file.originalname,
          mime_type: req.file.mimetype,
          size: req.file.size,
          url: fileUrl,
        },
      },
      meta: {
        message: 'Archivo subido exitosamente',
      },
    });
  } catch (error: any) {
    if (error.message.includes('Tipo de archivo no permitido')) {
      return res.status(400).json({
        error: {
          status: '400',
          title: 'Bad Request',
          detail: error.message,
        },
      });
    }
    next(error);
  }
};
