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
exports.resubscribeEgresadoController = void 0;
const resubscribeEgresadoController = (resubscribeEgresado) => (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.session.user.id;
    const result = yield resubscribeEgresado.execute(id);
    res.status(200).json({
        data: {
            type: 'egresados',
            id: String(id),
            attributes: {
                mensaje: 'Estado de suscripción actualizado correctamente.',
                is_active: result.is_active,
                estado_actual: result.estado_actual
            }
        }
    });
});
exports.resubscribeEgresadoController = resubscribeEgresadoController;
