import { FormularioRepository } from '../../../form/domain/port/formRepository';
import { SurveyAssignmentRepository } from '../../../surveyAssignment/domain/port/surveyAssignmentRepository';

export class GetSurveyFormattedByUuid {
  constructor(
    private formularioRepository: FormularioRepository,
    private surveyAssignmentRepository: SurveyAssignmentRepository
  ) {}

  async execute(uuid: string): Promise<{
    titulo_encuesta: string;
    descripcion: string | null;
    formulario: {
      titulo: string | null;
      preguntas: Array<{
        id: string;
        tipo: string;
        texto: string;
        es_obligatoria: boolean;
        orden: number;
        opciones: Array<{ id: string; valor: string }>;
      }>;
    };
  } | null> {
    // Obtener asignación de encuesta y datos básicos
    const assignment = await this.surveyAssignmentRepository.findByUuid(uuid);
    
    if (!assignment) return null;
    
    if (!assignment.is_active) {
      throw new Error('Acceso revocado');
    }

    // Obtener preguntas formateadas desde el repositorio
    const preguntas = await this.formularioRepository.getQuestionsFormattedForPublic(assignment.id_formulario);

    return {
      titulo_encuesta: assignment.nombre_encuesta,
      descripcion: assignment.descripcion_encuesta,
      formulario: {
        titulo: assignment.titulo_formulario,
        preguntas: preguntas
      }
    };
  }
}
