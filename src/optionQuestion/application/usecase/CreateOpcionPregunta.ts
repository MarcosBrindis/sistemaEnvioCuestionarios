import { OpcionPreguntaRepository } from '../../domain/port/opcionPreguntaRepository';
import { OpcionPregunta } from '../../domain/model/opcionPregunta';

export class CreateOpcionPregunta {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(data: Omit<OpcionPregunta, 'id_opcion_pregunta'>): Promise<OpcionPregunta> {
    // Validaciones básicas de la opción
    if (!data.texto_opcion || typeof data.texto_opcion !== 'string' || data.texto_opcion.trim() === '') {
      throw new Error('El campo texto_opcion es obligatorio y no puede estar vacío');
    }

    if (!data.etiqueta || typeof data.etiqueta !== 'string' || data.etiqueta.trim() === '') {
      throw new Error('El campo etiqueta es obligatorio y no puede estar vacío');
    }

    if (!data.id_pregunta || typeof data.id_pregunta !== 'number') {
      throw new Error('El campo id_pregunta es obligatorio');
    }

    // Verificar que la pregunta existe
    const questionExists = await this.repo.questionExists(data.id_pregunta);
    if (!questionExists) {
      throw new Error('La pregunta especificada no existe');
    }

    // Obtener el tipo de la pregunta para validar reglas de negocio
    const questionType = await this.repo.getQuestionType(data.id_pregunta);
    if (!questionType) {
      throw new Error('No se pudo determinar el tipo de la pregunta');
    }

    // Validar regla: preguntas abiertas no pueden tener opciones
    if (questionType === 'abierta') {
      throw new Error('Las preguntas de tipo "abierta" no pueden tener opciones');
    }

    // Validar unicidad del texto dentro de la pregunta
    const isTextUnique = await this.repo.isTextUniqueForQuestion(data.id_pregunta, data.texto_opcion.trim());
    if (!isTextUnique) {
      throw new Error('Ya existe una opción con el mismo texto para esta pregunta');
    }

    // Validar unicidad de la etiqueta dentro de la pregunta
    const isLabelUnique = await this.repo.isLabelUniqueForQuestion(data.id_pregunta, data.etiqueta.trim());
    if (!isLabelUnique) {
      throw new Error('Ya existe una opción con la misma etiqueta para esta pregunta');
    }

    // Contar opciones existentes para validar reglas por tipo
    const currentOptionsCount = await this.repo.countOptionsByQuestionId(data.id_pregunta);

    // Validar reglas específicas por tipo de pregunta
    if (questionType === 'boolean') {
      if (currentOptionsCount >= 2) {
        throw new Error('Las preguntas de tipo "boolean" pueden tener máximo 2 opciones');
      }
    }

    // Crear la opción
    const normalizedData = {
      ...data,
      texto_opcion: data.texto_opcion.trim(),
      etiqueta: data.etiqueta.trim()
    };

    const createdOption = await this.repo.create(normalizedData);

    return createdOption;
  }
}
