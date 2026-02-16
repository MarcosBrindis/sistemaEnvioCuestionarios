import { Router } from 'express';
import { fileDependencies } from '../../dependencies';
import { uploadFileController } from '../controller/uploadFileController';
import { getFileController, getFileMetadataController, getUserFilesController } from '../controller/getFileController';
import { deleteFileController } from '../controller/deleteFileController';
import { multerConfig } from '../../../../config/multer';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();
router.use(requestLogger);

/**
 * @openapi
 * /api/files/upload:
 *   post:
 *     tags:
 *       - Files
 *     summary: Subir un archivo (imagen o PDF)
 *     description: |
 *       Permite subir un archivo al servidor. El archivo se guarda en el sistema de archivos local
 *       y su metadata se almacena en la base de datos. Retorna un UUID único que puede usarse
 *       para acceder al archivo posteriormente.
 *       
 *       Tipos de archivo permitidos:
 *       - Imágenes: JPEG, PNG, GIF, WebP
 *       - Documentos: PDF
 *       
 *       Tamaño máximo: 10MB
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir
 *     responses:
 *       201:
 *         description: Archivo subido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: files
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "a3bb189e-8bf9-3888-9912-ace4e6543002"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         original_name:
 *                           type: string
 *                           example: "foto_perfil.jpg"
 *                         mime_type:
 *                           type: string
 *                           example: "image/jpeg"
 *                         size:
 *                           type: integer
 *                           example: 245678
 *                         url:
 *                           type: string
 *                           example: "http://localhost:3000/api/files/a3bb189e-8bf9-3888-9912-ace4e6543002"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Archivo subido exitosamente"
 *       400:
 *         description: Error en la solicitud (no se envió archivo o tipo no permitido)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/upload', multerConfig.single('file'), uploadFileController(fileDependencies.uploadFile));

/**
 * @openapi
 * /api/files/{id}:
 *   get:
 *     tags:
 *       - Files
 *     summary: Obtener un archivo por su ID
 *     description: Descarga el archivo físico asociado al UUID proporcionado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del archivo
 *     responses:
 *       200:
 *         description: Archivo encontrado
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/:id', getFileController(fileDependencies.getFile));

/**
 * @openapi
 * /api/files/{id}/info:
 *   get:
 *     tags:
 *       - Files
 *     summary: Obtener información de un archivo
 *     description: Retorna la metadata del archivo sin descargarlo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del archivo
 *     responses:
 *       200:
 *         description: Metadata del archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: files
 *                     id:
 *                       type: string
 *                       example: "a3bb189e-8bf9-3888-9912-ace4e6543002"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         original_name:
 *                           type: string
 *                         mime_type:
 *                           type: string
 *                         size:
 *                           type: integer
 *                         uploaded_at:
 *                           type: string
 *                           format: date-time
 *                         uploaded_by:
 *                           type: integer
 *                           nullable: true
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/:id/info', getFileMetadataController(fileDependencies.getFile));

/**
 * @openapi
 * /api/files/my-files:
 *   get:
 *     tags:
 *       - Files
 *     summary: Obtener todos los archivos del usuario autenticado
 *     description: Retorna la lista de archivos subidos por el usuario en sesión
 *     responses:
 *       200:
 *         description: Lista de archivos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: files
 *                       id:
 *                         type: string
 *                       attributes:
 *                         type: object
 *       401:
 *         description: No autenticado
 */
router.get('/my-files', getUserFilesController(fileDependencies.getFile));

/**
 * @openapi
 * /api/files/{id}:
 *   delete:
 *     tags:
 *       - Files
 *     summary: Eliminar un archivo
 *     description: Elimina el archivo físico y su metadata de la base de datos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del archivo a eliminar
 *     responses:
 *       204:
 *         description: Archivo eliminado exitosamente
 *       404:
 *         description: Archivo no encontrado
 */
router.delete('/:id', deleteFileController(fileDependencies.deleteFile));

export default router;
