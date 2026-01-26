import { Participant } from '../../domain/model/Participant';

export class TemplateEngineService {
  render(templateHtml: string, participant: Participant): string {
    const link = `${process.env.FRONTEND_PUBLIC_URL || ''}/survey/${participant.uuid}`;
    const variables: Record<string, string> = {
      nombre_completo: participant.nombre_completo,
      link_encuesta: link
    };

    return templateHtml.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key: string) => {
      return variables[key] ?? '';
    });
  }
}
