"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const uploadFileController_1 = require("../controller/uploadFileController");
const getFileController_1 = require("../controller/getFileController");
const deleteFileController_1 = require("../controller/deleteFileController");
const multer_1 = require("../../../../config/multer");
const requestLogger_1 = require("../../../../core/middleware/requestLogger");
const router = (0, express_1.Router)();
router.use(requestLogger_1.requestLogger);
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
router.post('/upload', multer_1.multerConfig.single('file'), (0, uploadFileController_1.uploadFileController)(dependencies_1.fileDependencies.uploadFile));
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
router.get('/:id', (0, getFileController_1.getFileController)(dependencies_1.fileDependencies.getFile));
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
router.get('/:id/info', (0, getFileController_1.getFileMetadataController)(dependencies_1.fileDependencies.getFile));
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
router.get('/my-files', (0, getFileController_1.getUserFilesController)(dependencies_1.fileDependencies.getFile));
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
router.delete('/:id', (0, deleteFileController_1.deleteFileController)(dependencies_1.fileDependencies.deleteFile));
exports.default = router;
