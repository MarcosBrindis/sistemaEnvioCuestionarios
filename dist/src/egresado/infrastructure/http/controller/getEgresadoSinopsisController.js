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
exports.getEgresadoSinopsisController = void 0;
const dependencies_1 = require("../../dependencies");
const GetEgresadoSinopsis_1 = require("../../../application/usecase/GetEgresadoSinopsis");
const getEgresadoSinopsisController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEgresado = Number(req.params.id);
        const usecase = new GetEgresadoSinopsis_1.GetEgresadoSinopsis(dependencies_1.egresadoRepository);
        const result = yield usecase.execute(idEgresado);
        res.status(200).json({
            data: {
                type: 'egresados-sinopsis',
                id: String(idEgresado),
                attributes: {
                    sinopsis: result.sinopsis,
                },
            },
        });
    }
    catch (error) {
        if (error.message === 'Egresado no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});
exports.getEgresadoSinopsisController = getEgresadoSinopsisController;
