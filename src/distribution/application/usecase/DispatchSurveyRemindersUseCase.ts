import { ParticipantRepository, ParticipantFilter } from '../../domain/port/ParticipantRepository';
import { TemplateRepository } from '../../domain/port/TemplateRepository';
import { MailingServiceClient } from '../../domain/port/MailingServiceClient';
import { TemplateEngineService } from '../service/TemplateEngineService';

export class DispatchSurveyRemindersUseCase {
  constructor(
    private participantRepo: ParticipantRepository,
    private templateRepo: TemplateRepository,
    private mailingClient: MailingServiceClient,
    private templateEngine: TemplateEngineService
  ) {}

  async execute(payload: { id_encuesta: number; id_template: number; filtro: ParticipantFilter }) {
    const { id_encuesta, id_template, filtro } = payload;
    const template = await this.templateRepo.findById(id_template);
    if (!template) throw new Error('Template no encontrado.');

    const participants = await this.participantRepo.findBySurvey(id_encuesta, filtro);
    const batchSize = Number(process.env.DISTRIBUTION_BATCH_SIZE || 50);

    const chunks: Array<typeof participants> = [];
    for (let i = 0; i < participants.length; i += batchSize) {
      chunks.push(participants.slice(i, i + batchSize));
    }

    let successCount = 0;
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (participant) => {
          try {
            const html = this.templateEngine.render(template.cuerpo, participant);
            const subject = this.templateEngine.render(template.asunto, participant);
            await this.mailingClient.sendEmail({
              to: participant.email,
              subject,
              html
            });
            successCount += 1;
          } catch {
            // error parcial: no detiene el lote
          }
        })
      );
    }

    return {
      survey_id: id_encuesta,
      target_filter: filtro,
      total_participants: participants.length,
      batches_processed: chunks.length,
      message: `Despacho completado. Se enviaron ${successCount} correos exitosamente.`
    };
  }
}
