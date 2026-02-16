import { Request, Response, NextFunction } from 'express';
import { GetFile } from '../../../application/usecase/GetFile';

export const getFileController = (getFile: GetFile) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Obtener archivo
    const { file, mimeType, originalName } = await getFile.execute(id);

    // Configurar headers para descarga
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);

    // Enviar archivo
    return res.send(file);
  } catch (error: any) {
    if (error.message === 'Archivo no encontrado' || error.message === 'Archivo físico no encontrado') {
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

export const getFileMetadataController = (getFile: GetFile) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Obtener metadata
    const fileMetadata = await getFile.getMetadata(id);

    return res.json({
      data: {
        type: 'files',
        id: fileMetadata.id,
        attributes: {
          original_name: fileMetadata.original_name,
          mime_type: fileMetadata.mime_type,
          size: fileMetadata.size,
          uploaded_at: fileMetadata.uploaded_at,
          uploaded_by: fileMetadata.uploaded_by,
        },
      },
    });
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

export const getUserFilesController = (getFile: GetFile) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionEgresadoId = req.session.user?.id;

    if (!sessionEgresadoId) {
      return res.status(401).json({
        error: {
          status: '401',
          title: 'Unauthorized',
          detail: 'No autenticado',
        },
      });
    }

    // Obtener archivos del usuario
    const files = await getFile.getFilesByUser(sessionEgresadoId);

    return res.json({
      data: files.map((file) => ({
        type: 'files',
        id: file.id,
        attributes: {
          original_name: file.original_name,
          mime_type: file.mime_type,
          size: file.size,
          uploaded_at: file.uploaded_at,
          url: `${req.protocol}://${req.get('host')}/api/files/${file.id}`,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
};
