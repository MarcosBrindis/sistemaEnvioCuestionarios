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
exports.DispatchSurveyRemindersUseCase = void 0;
class DispatchSurveyRemindersUseCase {
    constructor(participantRepo, templateRepo, mailingClient, templateEngine, assignSurveyGroup) {
        this.participantRepo = participantRepo;
        this.templateRepo = templateRepo;
        this.mailingClient = mailingClient;
        this.templateEngine = templateEngine;
        this.assignSurveyGroup = assignSurveyGroup;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id_encuesta, id_template, filtro, id_group } = payload;
            const template = yield this.templateRepo.findById(id_template);
            if (!template)
                throw new Error('Template no encontrado.');
            if (typeof id_group === 'number') {
                yield ((_a = this.assignSurveyGroup) === null || _a === void 0 ? void 0 : _a.execute(id_encuesta, id_group));
            }
            const participants = yield this.participantRepo.findBySurvey(id_encuesta, filtro);
            const batchSize = Number(process.env.DISTRIBUTION_BATCH_SIZE || 50);
            const chunks = [];
            for (let i = 0; i < participants.length; i += batchSize) {
                chunks.push(participants.slice(i, i + batchSize));
            }
            let successCount = 0;
            for (const chunk of chunks) {
                yield Promise.all(chunk.map((participant) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const baseBody = template.cuerpo || '';
                        const assembledHtml = template.layout_html
                            ? template.layout_html.replace('{{DYNAMIC_CONTENT}}', baseBody)
                            : baseBody;
                        const html = this.templateEngine.render(assembledHtml, participant);
                        const subject = this.templateEngine.render(template.asunto, participant);
                        yield this.mailingClient.sendEmail({
                            to: participant.email,
                            subject,
                            html
                        });
                        successCount += 1;
                    }
                    catch (_a) {
                        // error parcial: no detiene el lote
                    }
                })));
            }
            return {
                survey_id: id_encuesta,
                target_filter: filtro,
                total_participants: participants.length,
                batches_processed: chunks.length,
                message: `Despacho completado. Se enviaron ${successCount} correos exitosamente.`
            };
        });
    }
}
exports.DispatchSurveyRemindersUseCase = DispatchSurveyRemindersUseCase;
