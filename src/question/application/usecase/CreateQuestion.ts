import { QuestionRepository } from '../../domain/port/questionRepository';
import { Question } from '../../domain/model/question';

export class CreateQuestion {
  constructor(private repo: QuestionRepository) {}

  async execute(data: Omit<Question, 'id_pregunta'>): Promise<Question> {
    // Validaciones básicas de la pregunta
    if (!data.texto_pregunta || typeof data.texto_pregunta !== 'string' || data.texto_pregunta.trim() === '') {
      throw new Error('El campo texto_pregunta es obligatorio y no puede estar vacío');
    }

    if (!data.id_tipo_pregunta || typeof data.id_tipo_pregunta !== 'number') {
      throw new Error('El campo id_tipo_pregunta es obligatorio');
    }

    const typeQuestionExists = await this.repo.typeQuestionExists(data.id_tipo_pregunta);
    if (!typeQuestionExists) {
      throw new Error('El tipo de pregunta especificado no existe');
    }

    // Crear la pregunta
    const normalizedData = {
      ...data,
      texto_pregunta: data.texto_pregunta.trim(),
      es_obligatoria: data.es_obligatoria ?? false
    };

    const createdQuestion = await this.repo.create(normalizedData);

    // Si es tipo "likert", asignar automáticamente las opciones predefinidas
    const tipoNombre = await this.repo.getTypeQuestionName(data.id_tipo_pregunta);
    if (tipoNombre?.toLowerCase() === 'likert') {
      try {
        // Verificar si existen opciones likert predefinidas
        const likertOptionsExist = await this.repo.hasLikertOptions();
        if (likertOptionsExist) {
          // TODO: Cuando tengas el CRUD de opciones, aquí copiarás las opciones likert
          // predefinidas y las asociarás a esta pregunta
          console.log('TODO: Asignar opciones likert predefinidas a la pregunta', createdQuestion.id_pregunta);
        } else {
          console.warn('No se encontraron opciones likert predefinidas en el sistema');
        }
      } catch (error) {
        console.warn('Error al verificar opciones likert:', error);
      }
    }

    return createdQuestion;
  }
}
