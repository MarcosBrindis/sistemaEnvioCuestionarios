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
exports.deleteFileController = void 0;
const deleteFileController = (deleteFile) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Eliminar archivo
        yield deleteFile.execute(id);
        return res.status(204).send();
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
exports.deleteFileController = deleteFileController;
