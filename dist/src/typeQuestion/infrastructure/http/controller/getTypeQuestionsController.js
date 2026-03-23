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
exports.getTypeQuestionsController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getTypeQuestionsController = (getTypeQuestionById, getAllTypeQuestions) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        // Si hay ID, buscar uno específico
        if (id) {
            const typeQuestion = yield getTypeQuestionById.execute(Number(id));
            if (!typeQuestion) {
                res.status(404).json({
                    error: {
                        status: '404',
                        title: 'Not Found',
                        detail: 'El tipo de pregunta no fue encontrado'
                    }
                });
                return;
            }
            // Respuesta con formato JSON API para un recurso
            res.status(200).json({
                data: {
                    type: 'tipos-pregunta',
                    id: (_a = typeQuestion.id_tipo_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                    attributes: {
                        nombre: typeQuestion.nombre
                    }
                }
            });
            return;
        }
        // Si no hay ID, obtener todos
        const typeQuestions = yield getAllTypeQuestions.execute();
        // Respuesta con formato JSON API para colección
        res.status(200).json({
            data: typeQuestions.map(typeQuestion => {
                var _a;
                return ({
                    type: 'tipos-pregunta',
                    id: (_a = typeQuestion.id_tipo_pregunta) === null || _a === void 0 ? void 0 : _a.toString(),
                    attributes: {
                        nombre: typeQuestion.nombre
                    }
                });
            })
        });
    }
    catch (error) {
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getTypeQuestionsController = getTypeQuestionsController;
