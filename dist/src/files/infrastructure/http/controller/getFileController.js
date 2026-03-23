"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFilesController = exports.getFileMetadataController = exports.getFileController = void 0;
const getFileController = (getFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Obtener archivo
        const { file, mimeType, originalName } = yield getFile.execute(id);
        // Configurar headers para descarga
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
        // Enviar archivo
        return res.send(file);
    }
    catch (error) {
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
});
exports.getFileController = getFileController;
const getFileMetadataController = (getFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Obtener metadata
        const fileMetadata = yield getFile.getMetadata(id);
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
    }
    catch (error) {
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
});
exports.getFileMetadataController = getFileMetadataController;
const getUserFilesController = (getFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionEgresadoId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const files = yield getFile.getFilesByUser(sessionEgresadoId);
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
    }
    catch (error) {
        next(error);
    }
});
exports.getUserFilesController = getUserFilesController;
