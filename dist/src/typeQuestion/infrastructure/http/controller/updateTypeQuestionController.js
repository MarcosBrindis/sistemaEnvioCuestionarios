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
exports.updateTypeQuestionController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const updateTypeQuestionController = (updateTypeQuestion) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Validar estructura JSON API
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
        const id = Number(req.params.id);
        const { nombre } = req.body.data.attributes;
        const typeQuestion = yield updateTypeQuestion.execute(id, { nombre });
        // Respuesta con formato JSON API
        res.status(200).json({
            data: {
                type: 'tipos-pregunta',
                id: (_a = typeQuestion.id_tipo_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                attributes: {
                    nombre: typeQuestion.nombre
                }
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handleUpdateError)(error, req, res, next);
    }
});
exports.updateTypeQuestionController = updateTypeQuestionController;
