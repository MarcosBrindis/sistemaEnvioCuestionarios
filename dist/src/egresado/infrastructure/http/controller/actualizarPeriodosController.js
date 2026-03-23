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
exports.actualizarPeriodosController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const actualizarPeriodosController = (actualizarPeriodos) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const params = {
            programa: req.query.programa,
            matricula_like: req.query.matricula_like,
            periodo: req.query.periodo,
            periodo_from: req.query.periodo_from,
            periodo_to: req.query.periodo_to
        };
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));
        const result = yield actualizarPeriodos.execute(Object.keys(filteredParams).length > 0 ? filteredParams : undefined);
        res.status(200).json({
            data: {
                type: 'actualizacion-periodos',
                attributes: {
                    status: result.status,
                    resumen: result.resumen
                }
            },
            meta: {
                errores: (_a = result.errores) === null || _a === void 0 ? void 0 : _a.slice(0, 10) // Limitar errores mostrados
            }
        });
    }
    catch (error) {
        const err = error;
        console.error('Error en controlador de actualización de periodos:', err);
        if (err.message.includes('Error al obtener') || err.message.includes('Error en')) {
            res.status(502).json({
                error: {
                    status: '502',
                    title: 'Bad Gateway',
                    detail: `Error conectando con el servicio externo: ${err.message}`
                }
            });
        }
        else {
            (0, errorHandler_1.handlePostError)(err, req, res, next);
        }
    }
});
exports.actualizarPeriodosController = actualizarPeriodosController;
