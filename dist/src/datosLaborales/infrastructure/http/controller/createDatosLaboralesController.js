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
exports.createDatosLaboralesController = void 0;
const createDatosLaboralesController = (createDatosLaborales) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const sessionEgresadoId = (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!sessionEgresadoId) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const { trabaja_actualmente, nombre_empresa, puesto, id_sector, actividad_principal } = ((_b = req.body.data) === null || _b === void 0 ? void 0 : _b.attributes) || {};
        if (trabaja_actualmente === undefined) {
            return res.status(400).json({
                error: 'El campo "trabaja_actualmente" es obligatorio'
            });
        }
        const result = yield createDatosLaborales.execute({
            trabaja_actualmente,
            nombre_empresa: nombre_empresa || null,
            puesto: puesto || null,
            id_sector: id_sector || null,
            actividad_principal: actividad_principal || null,
            id_egresado: sessionEgresadoId
        });
        return res.status(201).json({
            data: {
                type: 'datos-laborales',
                id: result.id_datos_laborales,
                attributes: result
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createDatosLaboralesController = createDatosLaboralesController;
