import { ParticipantRepository } from '../../domain/port/ParticipantRepository';
import { TemplateRepository } from '../../domain/port/TemplateRepository';
import { MailingServiceClient } from '../../domain/port/MailingServiceClient';
import { TemplateEngineService } from '../service/TemplateEngineService';

export class DispatchBirthdayCongratsUseCase {
  constructor(
    private participantRepo: ParticipantRepository,
    private templateRepo: TemplateRepository,
    private mailingClient: MailingServiceClient,
    private templateEngine: TemplateEngineService
  ) {}

  async execute(payload: {
    id_template: number;
    referenceDate?: Date;
    targetEgresadoIds?: number[];
    targetEmails?: string[];
  }) {
    const {
      id_template,
      referenceDate = new Date(),
      targetEgresadoIds = [],
      targetEmails = []
    } = payload;
    const template = await this.templateRepo.findById(id_template);
    if (!template) throw new Error('Template de cumpleaños no encontrado.');

    const isTestMode = targetEgresadoIds.length > 0 || targetEmails.length > 0;
    const participants = isTestMode
      ? await this.participantRepo.findBirthdayTestTargets({
          egresadoIds: targetEgresadoIds,
          emails: targetEmails
        })
      : await this.participantRepo.findBirthdayCelebrants(referenceDate);

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
    const chunks: Array<typeof participants> = [];
    for (let i = 0; i < participants.length; i += batchSize) {
      chunks.push(participants.slice(i, i + batchSize));
    }

    let successCount = 0;
    let failedCount = 0;

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (participant) => {
          try {
            const baseBody = template.cuerpo || '';
            const assembledHtml = template.layout_html
              ? template.layout_html.replace('{{DYNAMIC_CONTENT}}', baseBody)
              : baseBody;
            const html = this.templateEngine.render(assembledHtml, participant);
            const subject = this.templateEngine.render(template.asunto, participant);

            await this.mailingClient.sendEmail({
              to: participant.email,
              subject,
              html
            });
            successCount += 1;
          } catch {
            failedCount += 1;
          }
        })
      );
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
  }
}
