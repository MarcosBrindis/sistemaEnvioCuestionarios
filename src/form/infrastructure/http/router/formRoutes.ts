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

/**
 * @openapi
 * /api/formulario:
 *   post:
 *     tags:
 *       - Formularios
 *     summary: Crear un nuevo formulario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormularioRequest'
 *     responses:
 *       201:
 *         description: Formulario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormularioResource'
 */
const createFormulario = createFormularioController(dependencies.createFormulario);

/**
 * @openapi
 * /api/formulario:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Obtener todos los formularios
 *     responses:
 *       200:
 *         description: Lista de formularios (sin relaciones anidadas)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FormularioResource'
 */
const getFormularios = getFormulariosController(
  dependencies.getAllFormularios,
  dependencies.getFormularioById
);

/**
 * @openapi
 * /api/formulario/{id}:
 *   patch:
 *     tags:
 *       - Formularios
 *     summary: Actualizar un formulario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormularioRequest'
 *     responses:
 *       200:
 *         description: Formulario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormularioResource'
 */
const updateFormulario = updateFormularioController(dependencies.updateFormulario);

/**
 * @openapi
 * /api/formulario/{id}:
 *   delete:
 *     tags:
 *       - Formularios
 *     summary: Eliminar un formulario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado correctamente
 */
const deleteFormulario = deleteFormularioController(dependencies.deleteFormulario);

/**
 * @openapi
 * /api/formulario/{id}/preguntas:
 *   post:
 *     tags:
 *       - Formularios
 *     summary: Asociar una pregunta al formulario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsociarPreguntaRequest'
 *     responses:
 *       201:
 *         description: Pregunta asociada al formulario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AsociarPreguntaResponse'
 *       400:
 *         description: Error de validación o formato
 *       404:
 *         description: Formulario o Pregunta no encontrada
 *       409:
 *         description: La pregunta ya está asociada al formulario
 */
const addPregunta = addPreguntaController(dependencies.addQuestionToFormulario);

/**
 * @openapi
 * /api/formulario/{id}/preguntas/{preguntaId}:
 *   delete:
 *     tags:
 *       - Formularios
 *     summary: Remover una pregunta de un formulario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: preguntaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pregunta removida
 */
const removePregunta = removePreguntaController(dependencies.removeQuestionFromFormulario);


router.post('/', createFormulario);
router.get('/', getFormularios);

/**
 * @openapi
 * /api/formulario/{id}:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Obtener un formulario por ID (incluye preguntas anidadas)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formulario con preguntas anidadas en relationships
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FormularioDetailResource'
 *       404:
 *         description: Formulario no encontrado
 */
router.get('/:id', getFormularios);
router.patch('/:id', updateFormulario);
router.delete('/:id', deleteFormulario);

// Asociaciones
router.post('/:id/preguntas', addPregunta);
router.delete('/:id/preguntas/:preguntaId', removePregunta);

/**
 * @openapi
 * /api/formulario/pregunta/{preguntaId}/count:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Contar en cuántos formularios participa una pregunta
 *     parameters:
 *       - in: path
 *         name: preguntaId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Conteo de formularios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     preguntaId:
 *                       type: string
 *                     formularios_count:
 *                       type: integer
 */
router.get('/pregunta/:preguntaId/count', async (req, res) => {
  const preguntaId = Number(req.params.preguntaId);
  if (isNaN(preguntaId)) {
    res.status(400).json({
      error: {
        status: '400',
        title: 'Bad Request',
        detail: 'preguntaId debe ser numérico'
      }
    });
    return;
  }
  try {
    const count = await dependencies.formularioRepo.countFormsByQuestionId(preguntaId);
    res.status(200).json({
      meta: {
        preguntaId: preguntaId.toString(),
        formularios_count: count
      }
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        status: '500',
        title: 'Server Error',
        detail: error.message
      }
    });
  }
});

export default router;