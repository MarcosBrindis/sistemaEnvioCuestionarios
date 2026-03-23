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
exports.GetQuestionsWithOptions = void 0;
const GetQuestionsWithOptions = (formularioRepo, formId) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield formularioRepo.getQuestionsWithOptionsByFormId(formId);
    return questions.map((q) => {
        var _a, _b;
        return ({
            type: 'preguntas',
            id: String(q.id),
            attributes: {
                texto_pregunta: q.texto_pregunta,
                es_obligatoria: q.es_obligatoria,
                orden_en_formulario: (_b = (_a = q.orden_en_formulario) !== null && _a !== void 0 ? _a : q.orden_en_formulario) !== null && _b !== void 0 ? _b : q.orden // fallback
            },
            relationships: {
                tipo_pregunta: {
                    data: { id: String(q.tipo_pregunta.id), nombre: q.tipo_pregunta.nombre }
                },
                opciones: Array.isArray(q.opciones) ? q.opciones.map((op) => {
                    var _a;
                    return ({
                        id: String((_a = op.id) !== null && _a !== void 0 ? _a : op.id_opcion_pregunta),
                        texto_opcion: op.texto_opcion,
                        etiqueta: op.etiqueta
                    });
                }) : []
            }
        });
    });
});
exports.GetQuestionsWithOptions = GetQuestionsWithOptions;
