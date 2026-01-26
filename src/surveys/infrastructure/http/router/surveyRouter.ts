import { Router } from 'express';
import { createSurveyController } from '../controller/createSurveyController';
import { getSurveysController } from '../controller/getSurveysController';
import { getSurveyByIdController } from '../controller/getSurveyByIdController';
import { getPublicSurveyByUuidController } from '../controller/getPublicSurveyByUuidController';
import { updateSurveyController } from '../controller/updateSurveyController';
import { deleteSurveyController } from '../controller/deleteSurveyController';
import { createSurveyUseCase, getSurveysUseCase, getSurveyByIdUseCase, updateSurveyUseCase, deleteSurveyUseCase, getPublicSurveyByUuidUseCase } from '../../dependencies';

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
