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
exports.DispatchBirthdayCongratsUseCase = void 0;
class DispatchBirthdayCongratsUseCase {
    constructor(participantRepo, templateRepo, mailingClient, templateEngine) {
        this.participantRepo = participantRepo;
        this.templateRepo = templateRepo;
        this.mailingClient = mailingClient;
        this.templateEngine = templateEngine;
    }
    execute(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_template, referenceDate = new Date(), targetEgresadoIds = [], targetEmails = [] } = payload;
            const template = yield this.templateRepo.findById(id_template);
            if (!template)
                throw new Error('Template de cumpleaños no encontrado.');
            const isTestMode = targetEgresadoIds.length > 0 || targetEmails.length > 0;
            const participants = isTestMode
                ? yield this.participantRepo.findBirthdayTestTargets({
                    egresadoIds: targetEgresadoIds,
                    emails: targetEmails
                })
                : yield this.participantRepo.findBirthdayCelebrants(referenceDate);
            if (participants.length === 0) {
                return {
                    mode: isTestMode ? 'test' : 'birthday-date',
                    date: referenceDate.toISOString().slice(0, 10),
                    template_id: id_template,
                    total_participants: 0,
                    sent: 0,
                    failed: 0,
                    message: isTestMode
                        ? 'No se encontraron egresados para los destinatarios de prueba indicados.'
                        : 'No hay egresados con cumpleaños en la fecha indicada.'
                };
            }
            const batchSize = Number(process.env.DISTRIBUTION_BATCH_SIZE || 50);
            const chunks = [];
            for (let i = 0; i < participants.length; i += batchSize) {
                chunks.push(participants.slice(i, i + batchSize));
            }
            let successCount = 0;
            let failedCount = 0;
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
                        failedCount += 1;
                    }
                })));
            }
            return {
                mode: isTestMode ? 'test' : 'birthday-date',
                date: referenceDate.toISOString().slice(0, 10),
                template_id: id_template,
                total_participants: participants.length,
                sent: successCount,
                failed: failedCount,
                message: isTestMode
                    ? `Despacho de prueba de cumpleaños completado. Exitosos: ${successCount}. Fallidos: ${failedCount}.`
                    : `Despacho de cumpleaños completado. Exitosos: ${successCount}. Fallidos: ${failedCount}.`
            };
        });
    }
}
exports.DispatchBirthdayCongratsUseCase = DispatchBirthdayCongratsUseCase;
