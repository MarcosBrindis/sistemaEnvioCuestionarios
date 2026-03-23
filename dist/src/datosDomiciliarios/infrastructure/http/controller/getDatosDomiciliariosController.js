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
exports.getDatosDomiciliariosController = void 0;
const getDatosDomiciliariosController = (getDatosDomiciliarios) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sessionEgresadoId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!sessionEgresadoId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const result = yield getDatosDomiciliarios.execute(sessionEgresadoId);
        if (!result) {
            return res.status(404).json({
                error: 'No se encontraron datos domiciliarios para este egresado'
            });
        }
        return res.json({
            data: {
                type: 'datos-domiciliarios',
                id: result.id_datos_domiciliarios,
                attributes: result
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getDatosDomiciliariosController = getDatosDomiciliariosController;
