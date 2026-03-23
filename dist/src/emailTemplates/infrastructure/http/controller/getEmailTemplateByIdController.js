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
exports.getEmailTemplateByIdController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const getEmailTemplateByIdController = (getEmailTemplateById) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = Number(req.params.id);
        const template = yield getEmailTemplateById.execute(id);
        if (!template) {
            res.status(404).json({
                error: {
                    status: '404',
                    title: 'Not Found',
                    detail: 'Email template not found'
                }
            });
            return;
        }
        res.status(200).json({
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
        (0, errorHandler_1.handleGetError)(error, req, res, next);
    }
});
exports.getEmailTemplateByIdController = getEmailTemplateByIdController;
