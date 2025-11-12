import { OpcionPreguntaRepository } from '../../domain/port/opcionPreguntaRepository';
import { OpcionPregunta } from '../../domain/model/opcionPregunta';

export class UpdateOpcionPregunta {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(id: number, data: Partial<OpcionPregunta>): Promise<OpcionPregunta> {
    // Verificar si la opción existe
    const existingOption = await this.repo.findById(id);
    if (!existingOption) {
      throw new Error('La opción de pregunta no existe');
    }

    // Si se está actualizando el texto_opcion, validar reglas de negocio
    if (data.texto_opcion !== undefined) {
      // Regla: El campo texto_opcion no puede ser nulo ni vacío
      if (typeof data.texto_opcion !== 'string' || data.texto_opcion.trim() === '') {
        throw new Error('El campo texto_opcion no puede estar vacío');
      }

      // Validar unicidad del texto dentro de la pregunta (excluyendo la opción actual)
      const isTextUnique = await this.repo.isTextUniqueForQuestion(
        existingOption.id_pregunta, 
        data.texto_opcion.trim(), 
        id
      );
      if (!isTextUnique) {
        throw new Error('Ya existe una opción con el mismo texto para esta pregunta');
      }
      
      data.texto_opcion = data.texto_opcion.trim();
    }

    // Si se está actualizando la etiqueta, validar unicidad
    if (data.etiqueta !== undefined) {
      if (typeof data.etiqueta !== 'string' || data.etiqueta.trim() === '') {
        throw new Error('El campo etiqueta no puede estar vacío');
      }

      // Validar unicidad de la etiqueta dentro de la pregunta (excluyendo la opción actual)
      const isLabelUnique = await this.repo.isLabelUniqueForQuestion(
        existingOption.id_pregunta, 
        data.etiqueta.trim(), 
        id
      );
      if (!isLabelUnique) {
        throw new Error('Ya existe una opción con la misma etiqueta para esta pregunta');
      }
      
      data.etiqueta = data.etiqueta.trim();
    }

    // Si se está cambiando la pregunta asociada, validar reglas
    if (data.id_pregunta !== undefined && data.id_pregunta !== existingOption.id_pregunta) {
      // Verificar que la nueva pregunta existe
      const questionExists = await this.repo.questionExists(data.id_pregunta);
      if (!questionExists) {
        throw new Error('La pregunta especificada no existe');
      }

      // Obtener el tipo de la nueva pregunta para validar reglas de negocio
      const questionType = await this.repo.getQuestionType(data.id_pregunta);
      if (!questionType) {
        throw new Error('No se pudo determinar el tipo de la nueva pregunta');
      }

      // Validar regla: preguntas abiertas no pueden tener opciones
      if (questionType === 'abierta') {
        throw new Error('Las preguntas de tipo "abierta" no pueden tener opciones');
      }

      // Contar opciones existentes en la nueva pregunta para validar reglas por tipo
      const currentOptionsCount = await this.repo.countOptionsByQuestionId(data.id_pregunta);

      // Validar reglas específicas por tipo de pregunta
      if (questionType === 'boolean') {
        if (currentOptionsCount >= 2) {
          throw new Error('Las preguntas de tipo "boolean" pueden tener máximo 2 opciones');
        }
      }

      // Validar unicidad del texto en la nueva pregunta
      if (data.texto_opcion || existingOption.texto_opcion) {
        const textoToCheck = data.texto_opcion || existingOption.texto_opcion;
        const isTextUniqueInNewQuestion = await this.repo.isTextUniqueForQuestion(data.id_pregunta, textoToCheck);
        if (!isTextUniqueInNewQuestion) {
          throw new Error('Ya existe una opción con el mismo texto en la pregunta de destino');
        }
      }

      // Validar unicidad de la etiqueta en la nueva pregunta
      if (data.etiqueta || existingOption.etiqueta) {
        const etiquetaToCheck = data.etiqueta || existingOption.etiqueta;
        const isLabelUniqueInNewQuestion = await this.repo.isLabelUniqueForQuestion(data.id_pregunta, etiquetaToCheck);
        if (!isLabelUniqueInNewQuestion) {
          throw new Error('Ya existe una opción con la misma etiqueta en la pregunta de destino');
        }
      }
    }
    
    // Actualizar la opción
    return await this.repo.update(id, data);
  }
}