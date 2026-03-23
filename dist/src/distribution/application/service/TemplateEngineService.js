"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngineService = void 0;
class TemplateEngineService {
    render(templateHtml, participant) {
        const link = `${process.env.FRONTEND_PUBLIC_URL || ''}/survey/${participant.uuid}`;
        const variables = {
            nombre_completo: participant.nombre_completo,
            link_encuesta: link
        };
        return templateHtml.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key) => {
            var _a;
            return (_a = variables[key]) !== null && _a !== void 0 ? _a : '';
        });
    }
}
exports.TemplateEngineService = TemplateEngineService;
