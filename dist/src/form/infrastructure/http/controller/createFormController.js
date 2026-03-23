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
exports.createFormularioController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createFormularioController = (createFormulario) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!req.body.data || !req.body.data.attributes) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado' } });
            return;
        }
        const attrs = req.body.data.attributes;
        const titulo = attrs.titulo;
        const descripcion = (_a = attrs.descripcion) !== null && _a !== void 0 ? _a : null;
        const is_active = attrs.is_active;
        const created = yield createFormulario.execute({ titulo, descripcion, is_active });
        res.status(201).json({
            data: {
                type: 'formularios',
                id: (_b = created.id_formulario) === null || _b === void 0 ? void 0 : _b.toString(),
                attributes: {
                    titulo: created.titulo,
                    descripcion: created.descripcion,
                    is_active: created.is_active,
                    fecha_creacion: created.fecha_creacion
                }
            }
        });
    }
    catch (error) {
        // Map basic messages to codes similarly a otros controladores
        if (error.message.includes('obligatorio') || error.message.includes('vacío') || error.message.includes('is_active')) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: error.message } });
        }
        else if (error.message.includes('Ya existe')) {
            res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
        }
        else {
            (0, errorHandler_1.handlePostError)(error, req, res, next);
        }
    }
});
exports.createFormularioController = createFormularioController;
