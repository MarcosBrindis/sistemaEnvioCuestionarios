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
exports.updateFormularioController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const updateFormularioController = (updateFormulario) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body.data || !req.body.data.attributes) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado' } });
            return;
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID debe ser numérico' } });
            return;
        }
        const attrs = req.body.data.attributes;
        const payload = {};
        if (attrs.titulo !== undefined)
            payload.titulo = attrs.titulo;
        if (attrs.descripcion !== undefined)
            payload.descripcion = attrs.descripcion;
        if (attrs.is_active !== undefined)
            payload.is_active = attrs.is_active;
        const updated = yield updateFormulario.execute(id, payload);
        res.status(200).json({
            data: {
                type: 'formularios',
                id: (_a = updated.id_formulario) === null || _a === void 0 ? void 0 : _a.toString(),
                attributes: {
                    titulo: updated.titulo,
                    descripcion: updated.descripcion,
                    is_active: updated.is_active,
                    fecha_creacion: updated.fecha_creacion
                }
            }
        });
    }
    catch (error) {
        if (error.message.includes('No existe') || error.message.includes('no existe')) {
            res.status(404).json({ error: { status: '404', title: 'Not Found', detail: error.message } });
        }
        else if (error.message.includes('Ya existe')) {
            res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
        }
        else {
            (0, errorHandler_1.handleUpdateError)(error, req, res, next);
        }
    }
});
exports.updateFormularioController = updateFormularioController;
