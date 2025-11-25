import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createOpcionPreguntaController } from '../controller/createOpcionPreguntaController';
import { updateOpcionPreguntaController } from '../controller/updateOpcionPreguntaController';
import { deleteOpcionPreguntaController } from '../controller/deleteOpcionPreguntaController';
import { getOpcionPreguntasController } from '../controller/getOpcionPreguntasController';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();

router.use(requestLogger);

/**
 * @openapi
 * /api/opcion-pregunta:
 *   post:
 *     tags:
 *       - Opciones de Pregunta
 *     summary: Crear una nueva opción
 *     description: Crea una opción asociada a una pregunta específica.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpcionPreguntaRequest'
 *     responses:
 *       201:
 *         description: Opción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionPreguntaResource'
 *       400:
 *         description: Error de formato o datos faltantes
 *       409:
 *         description: Conflicto (ej. la pregunta no acepta opciones)
 */
const createOpcionPregunta = createOpcionPreguntaController(dependencies.createOpcionPregunta);

/**
 * @openapi
 * /api/opcion-pregunta/{id}:
 *   patch:
 *     tags:
 *       - Opciones de Pregunta
 *     summary: Actualizar una opción existente
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
 *             $ref: '#/components/schemas/OpcionPreguntaRequest'
 *     responses:
 *       200:
 *         description: Opción actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionPreguntaResource'
 */
const updateOpcionPregunta = updateOpcionPreguntaController(dependencies.updateOpcionPregunta);

/**
 * @openapi
 * /api/opcion-pregunta/{id}:
 *   delete:
 *     tags:
 *       - Opciones de Pregunta
 *     summary: Eliminar una opción
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Opción eliminada correctamente
 */
const deleteOpcionPregunta = deleteOpcionPreguntaController(dependencies.deleteOpcionPregunta);

/**
 * @openapi
 * /api/opcion-pregunta:
 *   get:
 *     tags:
 *       - Opciones de Pregunta
 *     summary: Obtener opciones (todas o por pregunta)
 *     parameters:
 *       - in: query
 *         name: preguntaId
 *         schema:
 *           type: integer
 *         description: Filtrar opciones pertenecientes a una pregunta específica
 *     responses:
 *       200:
 *         description: Lista de opciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OpcionPreguntaResource'
 */
const getOpcionesPreguntas = getOpcionPreguntasController(
  dependencies.getOpcionPreguntaById,
  dependencies.getAllOpcionesPreguntas,
  dependencies.getOpcionPreguntasByQuestionId
);

router.post('/', createOpcionPregunta);
router.get('/', getOpcionesPreguntas);

/**
 * @openapi
 * /api/opcion-pregunta/{id}:
 *   get:
 *     tags:
 *       - Opciones de Pregunta
 *     summary: Obtener una opción por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la opción
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpcionPreguntaResource'
 *       404:
 *         description: Opción no encontrada
 */
router.get('/:id', getOpcionesPreguntas);
router.patch('/:id', updateOpcionPregunta);
router.delete('/:id', deleteOpcionPregunta);

export default router;