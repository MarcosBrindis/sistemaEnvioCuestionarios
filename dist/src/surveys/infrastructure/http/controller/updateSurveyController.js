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
exports.updateSurveyController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const updateSurveyController = (updateSurvey) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { data } = req.body;
        if (!data || !data.attributes) {
            res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON:API requerido' } });
            return;
        }
        const updateData = {};
        if (data.attributes.nombre)
            updateData.name = data.attributes.nombre;
        if (data.attributes.descripcion)
            updateData.description = data.attributes.descripcion;
        if (typeof data.attributes.is_active === 'boolean')
            updateData.isActive = data.attributes.is_active;
        if (data.relationships && data.relationships.formulario)
            updateData.formId = Number(data.relationships.formulario.data.id);
        if (data.relationships && data.relationships['template-correo'])
            updateData.templateId = Number(data.relationships['template-correo'].data.id);
        const survey = yield updateSurvey.execute(id, updateData);
        if (!survey) {
            res.status(404).json({ error: { status: '404', title: 'Not Found', detail: 'Survey not found' } });
            return;
        }
        res.status(200).json({ data: { type: 'encuestas', id: survey.id.toString(), attributes: { nombre: survey.name, descripcion: survey.description, is_active: survey.isActive }, relationships: { formulario: { data: { type: 'formularios', id: survey.formId } }, 'template-correo': { data: { type: 'templates-correo', id: survey.templateId } } } } });
    }
    catch (error) {
        (0, errorHandler_1.handleUpdateError)(error, req, res, next);
    }
});
exports.updateSurveyController = updateSurveyController;
