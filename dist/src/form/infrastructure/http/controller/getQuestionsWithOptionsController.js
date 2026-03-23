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
exports.getQuestionsWithOptionsController = void 0;
const GetQuestionsWithOptions_1 = require("../../../application/usecase/GetQuestionsWithOptions");
const dependencies_1 = require("../../dependencies");
const getQuestionsWithOptionsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const formId = parseInt(req.params.id);
    if (isNaN(formId)) {
        return res.status(400).json({ error: 'ID de formulario inválido' });
    }
    try {
        const questions = yield (0, GetQuestionsWithOptions_1.GetQuestionsWithOptions)(dependencies_1.dependencies.formularioRepo, formId);
        return res.status(200).json({ data: questions });
    }
    catch (error) {
        return res.status(500).json({ error: 'Error al obtener las preguntas y opciones del formulario' });
    }
});
exports.getQuestionsWithOptionsController = getQuestionsWithOptionsController;
