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
exports.getTiposCorreoController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getTiposCorreoController = (getTiposCorreo) => (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tiposCorreo = yield getTiposCorreo.execute();
        res.status(200).json({
            data: tiposCorreo.map((tipoCorreo) => {
                var _a;
                return ({
                    type: 'tipos-correo',
                    id: (_a = tipoCorreo.id_tipo_correo) === null || _a === void 0 ? void 0 : _a.toString(),
                    attributes: {
                        tipo: tipoCorreo.tipo
                    }
                });
            })
        });
    }
    catch (error) {
        (0, errorHandler_1.handleGetError)(error, _req, res, next);
    }
});
exports.getTiposCorreoController = getTiposCorreoController;
