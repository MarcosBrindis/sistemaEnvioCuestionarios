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
exports.deleteTypeQuestionController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const deleteTypeQuestionController = (deleteTypeQuestion) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        yield deleteTypeQuestion.execute(id);
        // Para DELETE exitoso, JSON API permite respuesta 204 sin cuerpo o 200 con meta información
        res.status(204).send();
    }
    catch (error) {
        (0, errorHandler_1.handleDeleteError)(error, req, res, next);
    }
});
exports.deleteTypeQuestionController = deleteTypeQuestionController;
