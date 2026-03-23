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
exports.updateEgresadoSinopsisController = void 0;
const dependencies_1 = require("../../dependencies");
const UpdateEgresadoSinopsis_1 = require("../../../application/usecase/UpdateEgresadoSinopsis");
const updateEgresadoSinopsisController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const idEgresado = Number(req.params.id);
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Cuerpo de solicitud inválido' });
        }
        const attrs = data.attributes || {};
        const usecase = new UpdateEgresadoSinopsis_1.UpdateEgresadoSinopsis(dependencies_1.egresadoRepository);
        const actualizado = yield usecase.execute(idEgresado, {
            sinopsis: (_a = attrs.sinopsis) !== null && _a !== void 0 ? _a : undefined,
        });
        res.status(200).json({
            data: {
                type: 'egresados',
                id: String(actualizado.id_egresado),
                attributes: {
                    nombre: actualizado.nombre,
                    primer_apellido: actualizado.primer_apellido,
                    segundo_apellido: actualizado.segundo_apellido,
                    matricula: actualizado.matricula,
                    curp: actualizado.curp,
                    email: actualizado.email,
                    imagen_egresado: actualizado.imagen_egresado,
                    sinopsis: actualizado.sinopsis,
                    fecha_nacimiento: actualizado.fecha_nacimiento,
                    is_active: actualizado.is_active,
                    id_estado: actualizado.id_estado,
                    id_programa_educativo: actualizado.id_programa_educativo,
                    id_periodo: actualizado.id_periodo,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateEgresadoSinopsisController = updateEgresadoSinopsisController;
