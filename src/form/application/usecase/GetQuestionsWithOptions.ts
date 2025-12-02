export const GetQuestionsWithOptions = async (formularioRepo: any, formId: number): Promise<any[]> => {
  const questions = await formularioRepo.getQuestionsWithOptionsByFormId(formId);
  return questions.map((q: any) => ({
    type: 'preguntas',
    id: String(q.id),
    attributes: {
      texto_pregunta: q.texto_pregunta,
      es_obligatoria: q.es_obligatoria,
      orden_en_formulario: q.orden_en_formulario ?? q.orden_en_formulario ?? q.orden // fallback
    },
    relationships: {
      tipo_pregunta: {
        data: { id: String(q.tipo_pregunta.id), nombre: q.tipo_pregunta.nombre }
      },
      opciones: Array.isArray(q.opciones) ? q.opciones.map((op: any) => ({
        id: String(op.id ?? op.id_opcion_pregunta),
        texto_opcion: op.texto_opcion,
        etiqueta: op.etiqueta
      })) : []
    }
  }));
};
