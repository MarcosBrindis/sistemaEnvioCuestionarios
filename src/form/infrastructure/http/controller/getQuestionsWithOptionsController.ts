import { Request, Response } from 'express';
import { GetQuestionsWithOptions } from '../../../application/usecase/GetQuestionsWithOptions';
import { dependencies } from '../../dependencies';

export const getQuestionsWithOptionsController = async (req: Request, res: Response) => {
  const formId = parseInt(req.params.id);
  if (isNaN(formId)) {
    return res.status(400).json({ error: 'ID de formulario inválido' });
  }

  try {
    const questions = await GetQuestionsWithOptions(dependencies.formularioRepo, formId);
    return res.status(200).json({ data: questions });
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las preguntas y opciones del formulario' });
  }
};
