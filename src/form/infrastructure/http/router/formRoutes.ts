import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createFormularioController } from '../controller/createFormController';
import { getFormulariosController } from '../controller/getFormController';
import { updateFormularioController } from '../controller/updateFormController';
import { deleteFormularioController } from '../controller/deleteFormController';
import { addPreguntaController } from '../controller/addQuestionController';
import { removePreguntaController } from '../controller/removeQuestionController';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();

router.use(requestLogger);

const createFormulario = createFormularioController(dependencies.createFormulario);
const getFormularios = getFormulariosController(dependencies.getAllFormularios, dependencies.getFormularioById);
const updateFormulario = updateFormularioController(dependencies.updateFormulario);
const deleteFormulario = deleteFormularioController(dependencies.deleteFormulario);
const addPregunta = addPreguntaController(dependencies.addQuestionToFormulario);
const removePregunta = removePreguntaController(dependencies.removeQuestionFromFormulario);

// CRUD
router.post('/', createFormulario);
router.get('/', getFormularios);
router.get('/:id', getFormularios);
router.patch('/:id', updateFormulario);
router.delete('/:id', deleteFormulario);

// Asociaciones
router.post('/:id/preguntas', addPregunta);
router.delete('/:id/preguntas/:preguntaId', removePregunta);

// Conteo: en cuántos formularios está una pregunta
router.get('/pregunta/:preguntaId/count', async (req, res) => {
  const preguntaId = Number(req.params.preguntaId);
  if (isNaN(preguntaId)) {
    res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'preguntaId debe ser numérico' }});
    return;
  }
  try {
    const count = await dependencies.formularioRepo.countFormsByQuestionId(preguntaId);
    res.status(200).json({ meta: { preguntaId: preguntaId.toString(), formularios_count: count }});
  } catch (error: any) {
    res.status(500).json({ error: { status: '500', title: 'Server Error', detail: error.message }});
  }
});

export default router;
