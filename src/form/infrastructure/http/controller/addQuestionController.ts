import { Request, Response, NextFunction } from 'express';
import { AddQuestionToFormulario } from '../../../application/usecase/AddQuestionToForm';
import { handlePostError } from '../../../../core/middleware/errorHandler';

export const addPreguntaController = (addQuestion: AddQuestionToFormulario) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const formularioId = Number(req.params.id);
    if (isNaN(formularioId)) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID de formulario inválido' }});
      return;
    }

    if (!req.body.data || !req.body.data.type || !req.body.data.id) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado en body.data (pregunta)' }});
      return;
    }

    const preguntaId = Number(req.body.data.id);
    const orden = Number(req.body.meta?.orden);

    if (isNaN(preguntaId) || isNaN(orden)) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'preguntaId y orden deben ser numéricos' }});
      return;
    }

    await addQuestion.execute(formularioId, preguntaId, orden);

    res.status(201).json({
      data: {
        type: 'formulacion-pregunta',
        attributes: {
          id_formulario: formularioId.toString(),
          id_pregunta: preguntaId.toString(),
          orden
        }
      }
    });
  } catch (error: any) {
    if (error.message.includes('no existe') || error.message.includes('No existe')) {
      res.status(404).json({ error: { status: '404', title: 'Not Found', detail: error.message }});
    } else if (error.message.includes('Ya existe') || error.message.includes('ya')) {
      res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message }});
    } else if (error.message.includes('orden')) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: error.message }});
    } else {
      handlePostError(error, req, res, next);
    }
  }
};
