import { RespuestaRepository } from '../../../respuesta/domain/port/respuestaRepository';
import { SurveyAssignmentRepository } from '../../../surveyAssignment/domain/port/surveyAssignmentRepository';

export class SubmitPublicSurveyResponseUseCase {
  constructor(
    private respuestaRepository: RespuestaRepository,
    private surveyAssignmentRepository: SurveyAssignmentRepository
  ) {}

  async execute(uuid: string, respuestas_json: any): Promise<{
    id_respuesta: number;
    mensaje: string;
  }> {
    const assignment = await this.surveyAssignmentRepository.findByUuid(uuid);

    if (!assignment) {
      throw new Error('Acceso no encontrado');
    }

    if (!assignment.is_active) {
      throw new Error('Acceso revocado');
    }

    const respuesta = await this.respuestaRepository.create({
      id_egresado: assignment.id_egresado,
      id_formulario: assignment.id_formulario,
      respuestas_json: respuestas_json
    });

    return {
      id_respuesta: respuesta.id_respuesta!,
      mensaje: 'Respuestas registradas correctamente'
    };
  }
}
