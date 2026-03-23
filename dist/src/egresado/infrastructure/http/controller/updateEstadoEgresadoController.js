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
exports.updateEstadoEgresadoController = void 0;
const updateEstadoEgresadoController = (updateEstadoEgresado) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const egresadoId = Number(req.params.id);
        const { id_estado } = ((_a = req.body.data) === null || _a === void 0 ? void 0 : _a.attributes) || {};
        if (!id_estado) {
            return res.status(400).json({ error: 'El estado (id_estado) es requerido' });
        }
        const result = yield updateEstadoEgresado.execute({
            id: egresadoId,
            id_estado: Number(id_estado),
        });
        return res.json({
            data: {
                type: 'egresados',
                id: result.id_egresado,
                attributes: result
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateEstadoEgresadoController = updateEstadoEgresadoController;
