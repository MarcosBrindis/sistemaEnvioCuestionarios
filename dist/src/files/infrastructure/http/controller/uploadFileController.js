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
exports.uploadFileController = void 0;
const uploadFileController = (uploadFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const uploadedBy = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        // Ejecutar caso de uso
        const result = yield uploadFile.execute(req.file.buffer, req.file.originalname, req.file.mimetype, req.file.size, uploadedBy);
        // Construir URL de acceso al archivo usando la ruta estática
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${result.relativePath}`;
        return res.status(201).json({
            data: {
                type: 'files',
                id: result.uuid,
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
    }
    catch (error) {
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
});
exports.uploadFileController = uploadFileController;
