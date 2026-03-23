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
exports.getFormulariosController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getFormulariosController = (getAllFormularios, getFormularioById) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        if (id) {
            const numId = Number(id);
            if (isNaN(numId)) {
                res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID debe ser numérico' } });
                return;
            }
            const formulario = yield getFormularioById.execute(numId);
            if (!formulario) {
                res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Formulario no encontrado' } });
                return;
            }
            res.status(200).json({
                data: {
                    type: 'formularios',
                    id: (_a = formulario.id_formulario) === null || _a === void 0 ? void 0 : _a.toString(),
                    attributes: {
                        titulo: formulario.titulo,
                        descripcion: formulario.descripcion,
                        is_active: formulario.is_active,
                        fecha_creacion: formulario.fecha_creacion
                    },
                    relationships: {
                        preguntas: {
                            data: ((_b = formulario.preguntas) === null || _b === void 0 ? void 0 : _b.map(p => ({
                                type: 'pregunta',
                                id: p.id_pregunta.toString(),
                                attributes: { orden: p.orden }
                            }))) || []
                        }
                    }
                }
            });
            return;
        }
        const all = yield getAllFormularios.execute();
        res.status(200).json({
            data: all.map(f => {
                var _a;
                return ({
                    type: 'formularios',
                    id: (_a = f.id_formulario) === null || _a === void 0 ? void 0 : _a.toString(),
                    attributes: {
                        titulo: f.titulo,
                        descripcion: f.descripcion,
                        is_active: f.is_active,
                        fecha_creacion: f.fecha_creacion
                    }
                });
            })
        });
    }
    catch (error) {
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getFormulariosController = getFormulariosController;
