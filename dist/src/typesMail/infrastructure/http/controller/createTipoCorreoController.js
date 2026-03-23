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
exports.createTipoCorreoController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createTipoCorreoController = (createTipoCorreo) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body.data || !req.body.data.attributes) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'El formato debe seguir la especificación JSON API'
                }
            });
            return;
        }
        const { tipo } = req.body.data.attributes;
        const tipoCorreo = yield createTipoCorreo.execute(tipo);
        res.status(201).json({
            data: {
                type: 'tipos-correo',
                id: (_a = tipoCorreo.id_tipo_correo) === null || _a === void 0 ? void 0 : _a.toString(),
                attributes: {
                    tipo: tipoCorreo.tipo
                }
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handlePostError)(error, req, res, next);
    }
});
exports.createTipoCorreoController = createTipoCorreoController;
