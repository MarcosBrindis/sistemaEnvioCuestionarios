import { Router } from 'express';
import { createSurveyController } from '../controller/createSurveyController';
import { getSurveysController } from '../controller/getSurveysController';
import { getSurveyByIdController } from '../controller/getSurveyByIdController';
import { getPublicSurveyByUuidController } from '../controller/getPublicSurveyByUuidController';
import { getPublicSurveyFormattedController } from '../controller/getPublicSurveyFormattedController';
import { submitPublicSurveyResponseController } from '../controller/submitPublicSurveyResponseController';
import { updateSurveyController } from '../controller/updateSurveyController';
import { deleteSurveyController } from '../controller/deleteSurveyController';
import { createSurveyUseCase, getSurveysUseCase, getSurveyByIdUseCase, updateSurveyUseCase, deleteSurveyUseCase, getPublicSurveyByUuidUseCase, getSurveyFormattedByUuidUseCase, submitPublicSurveyResponseUseCase } from '../../dependencies';

const router = Router();

/**
 * @swagger
 * /api/encuestas:
 *   post:
 *     summary: Create a new survey
 *     tags: [Surveys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyInput'
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyResource'
 *       400:
 *         description: Bad request
 */
router.post('/', createSurveyController(createSurveyUseCase));

/**
 * @swagger
 * /api/encuestas:
 *   get:
 *     summary: Get all surveys (paginated, filtered)
 *     tags: [Surveys]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Search by name
 *     responses:
 *       200:
 *         description: List of surveys with pagination meta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyListResponse'
 */
router.get('/', getSurveysController(getSurveysUseCase));

/**
 * @swagger
 * /api/encuestas/publico/{uuid}:
 *   get:
 *     summary: Obtener encuesta pública por UUID
 *     tags: [Surveys]
 *     description: Devuelve la encuesta, formulario, preguntas, opciones y tipo de pregunta para el encuestado.
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID del encuestado (encuesta_egresados)
 *     responses:
 *       200:
 *         description: Datos completos para contestar la encuesta
 *       403:
 *         description: Acceso revocado
 *       404:
 *         description: No encontrado
 */
router.get('/publico/:uuid', getPublicSurveyByUuidController(getPublicSurveyByUuidUseCase));

/**
 * @swagger
 * /api/encuestas/responder/{uuid}:
 *   get:
 *     summary: Obtener encuesta formateada para responder (endpoint público)
 *     tags: [Public Surveys]
 *     description: Devuelve la encuesta en el formato esperado por el frontend sin exponer IDs internos
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID del encuestado (encuesta_egresados)
 *     responses:
 *       200:
 *         description: Datos de la encuesta formateados para el frontend
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 titulo_encuesta:
 *                   type: string
 *                   example: "Seguimiento 2026"
 *                 descripcion:
 *                   type: string
 *                 formulario:
 *                   type: object
 *                   properties:
 *                     titulo:
 *                       type: string
 *                     preguntas:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           tipo:
 *                             type: string
 *                           texto:
 *                             type: string
 *                           es_obligatoria:
 *                             type: boolean
 *                           orden:
 *                             type: number
 *                           opciones:
 *                             type: array
 *                             items:
 *                               type: object
 *       403:
 *         description: Acceso revocado
 *       404:
 *         description: Encuesta no encontrada
 */
router.get('/responder/:uuid', getPublicSurveyFormattedController(getSurveyFormattedByUuidUseCase));

/**
 * @swagger
 * /api/encuestas/responder/{uuid}:
 *   post:
 *     summary: Enviar respuestas de encuesta (endpoint público)
 *     tags: [Public Surveys]
 *     description: Registra las respuestas del egresado a la encuesta
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: UUID del encuestado (encuesta_egresados)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuestas_json
 *             properties:
 *               respuestas_json:
 *                 type: object
 *                 description: Objeto con las respuestas key=id_pregunta, value=respuesta
 *                 example:
 *                   "101": "Si"
 *                   "102": "Comentario del usuario"
 *     responses:
 *       201:
 *         description: Respuestas registradas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_respuesta:
 *                       type: number
 *                     mensaje:
 *                       type: string
 *       400:
 *         description: Datos incompletos o inválidos
 *       403:
 *         description: Acceso revocado
 *       404:
 *         description: Encuesta no encontrada
 *       409:
 *         description: El egresado ya respondió esta encuesta
 */
router.post('/responder/:uuid', submitPublicSurveyResponseController(submitPublicSurveyResponseUseCase));

/**
 * @swagger
 * /api/encuestas/{id}:
 *   get:
 *     summary: Get survey by ID
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Survey ID
 *     responses:
 *       200:
 *         description: Survey found
 *       404:
 *         description: Not found
 */
router.get('/:id', getSurveyByIdController(getSurveyByIdUseCase));

/**
 * @swagger
 * /api/encuestas/{id}:
 *   patch:
 *     summary: Update a survey
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Survey ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyInput'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyResource'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.patch('/:id', updateSurveyController(updateSurveyUseCase));

/**
 * @swagger
 * /api/encuestas/{id}:
 *   delete:
 *     summary: Delete survey (intelligent)
 *     tags: [Surveys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Survey ID
 *     responses:
 *       204:
 *         description: Deleted
 *       200:
 *         description: Deactivated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.delete('/:id', deleteSurveyController(deleteSurveyUseCase));

export default router;
