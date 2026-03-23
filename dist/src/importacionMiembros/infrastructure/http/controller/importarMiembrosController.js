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
exports.importarMiembrosController = void 0;
const importarMiembrosController = (importarMiembrosPorFiltro) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const idGrupo = Number(req.params.id);
        const filtros = ((_c = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.attributes) === null || _c === void 0 ? void 0 : _c.filtros) || {};
        const resultado = yield importarMiembrosPorFiltro.execute(idGrupo, filtros);
        res.status(200).json({
            data: {
                type: 'importacion-masiva',
                attributes: resultado
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.importarMiembrosController = importarMiembrosController;
