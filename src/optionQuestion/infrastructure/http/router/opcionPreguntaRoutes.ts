import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createOpcionPreguntaController } from '../controller/createOpcionPreguntaController';
import { updateOpcionPreguntaController } from '../controller/updateOpcionPreguntaController';
import { deleteOpcionPreguntaController } from '../controller/deleteOpcionPreguntaController';
import { getOpcionPreguntasController } from '../controller/getOpcionPreguntasController';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();

// Aplicar requestLogger a todas las rutas de opciones
router.use(requestLogger);

// Controladores
const createOpcionPregunta = createOpcionPreguntaController(dependencies.createOpcionPregunta);
const updateOpcionPregunta = updateOpcionPreguntaController(dependencies.updateOpcionPregunta);
const deleteOpcionPregunta = deleteOpcionPreguntaController(dependencies.deleteOpcionPregunta);
const getOpcionesPreguntas = getOpcionPreguntasController(
  dependencies.getOpcionPreguntaById,
  dependencies.getAllOpcionesPreguntas,
  dependencies.getOpcionPreguntasByQuestionId
);

// Rutas 
router.post('/', createOpcionPregunta);
router.get('/', getOpcionesPreguntas);
router.get('/:id', getOpcionesPreguntas);
router.patch('/:id', updateOpcionPregunta);
router.delete('/:id', deleteOpcionPregunta);

export default router;