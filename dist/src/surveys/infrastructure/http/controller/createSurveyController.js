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
exports.createSurveyController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createSurveyController = (createSurvey) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        if (!data || !data.attributes || !data.relationships) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
            return;
        }
        const { nombre, descripcion } = data.attributes;
        const formId = Number(data.relationships.formulario.data.id);
        const templateId = Number(data.relationships['template-correo'].data.id);
        const survey = yield createSurvey.execute({ name: nombre, description: descripcion, isActive: true, formId, templateId });
        res.status(201).json({
            data: {
                type: 'encuestas',
                id: survey.id.toString(),
                attributes: {
                    nombre: survey.name,
                    descripcion: survey.description,
                    is_active: survey.isActive
                },
                relationships: {
                    formulario: { data: { type: 'formularios', id: survey.formId } },
                    'template-correo': { data: { type: 'templates-correo', id: survey.templateId } }
                }
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handlePostError)(error, req, res, next);
    }
});
exports.createSurveyController = createSurveyController;
