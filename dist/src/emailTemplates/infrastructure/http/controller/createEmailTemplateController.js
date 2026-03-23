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
exports.createEmailTemplateController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const createEmailTemplateController = (createEmailTemplate) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.body.data || !req.body.data.attributes || !req.body.data.relationships || !req.body.data.relationships.tipo_correo) {
            res.status(400).json({
                error: {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'The format must follow JSON:API specification'
                }
            });
            return;
        }
        const { asunto, cuerpo, layout_html } = req.body.data.attributes;
        const typeId = Number(req.body.data.relationships.tipo_correo.data.id);
        const template = yield createEmailTemplate.execute({
            subject: asunto,
            body: cuerpo,
            layoutHtml: layout_html !== null && layout_html !== void 0 ? layout_html : null,
            typeId
        });
        res.status(201).json({
            data: {
                type: 'templates-correo',
                id: template.id.toString(),
                attributes: {
                    subject: template.subject,
                    body: template.body,
                    layout_html: (_a = template.layoutHtml) !== null && _a !== void 0 ? _a : null
                },
                relationships: {
                    tipo_correo: { data: { type: 'tipo_correo', id: template.typeId } }
                }
            }
        });
    }
    catch (error) {
        (0, errorHandler_1.handlePostError)(error, req, res, next);
    }
});
exports.createEmailTemplateController = createEmailTemplateController;
