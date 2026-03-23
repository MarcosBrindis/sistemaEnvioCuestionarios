"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createSurveyController_1 = require("../controller/createSurveyController");
const getSurveysController_1 = require("../controller/getSurveysController");
const getSurveyByIdController_1 = require("../controller/getSurveyByIdController");
const getPublicSurveyByUuidController_1 = require("../controller/getPublicSurveyByUuidController");
const getPublicSurveyFormattedController_1 = require("../controller/getPublicSurveyFormattedController");
const submitPublicSurveyResponseController_1 = require("../controller/submitPublicSurveyResponseController");
const updateSurveyController_1 = require("../controller/updateSurveyController");
const deleteSurveyController_1 = require("../controller/deleteSurveyController");
const dependencies_1 = require("../../dependencies");
const router = (0, express_1.Router)();
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
router.post('/', (0, createSurveyController_1.createSurveyController)(dependencies_1.createSurveyUseCase));
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
router.get('/', (0, getSurveysController_1.getSurveysController)(dependencies_1.getSurveysUseCase));
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
router.get('/publico/:uuid', (0, getPublicSurveyByUuidController_1.getPublicSurveyByUuidController)(dependencies_1.getPublicSurveyByUuidUseCase));
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
router.get('/responder/:uuid', (0, getPublicSurveyFormattedController_1.getPublicSurveyFormattedController)(dependencies_1.getSurveyFormattedByUuidUseCase));
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
router.post('/responder/:uuid', (0, submitPublicSurveyResponseController_1.submitPublicSurveyResponseController)(dependencies_1.submitPublicSurveyResponseUseCase));
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
router.get('/:id', (0, getSurveyByIdController_1.getSurveyByIdController)(dependencies_1.getSurveyByIdUseCase));
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
router.patch('/:id', (0, updateSurveyController_1.updateSurveyController)(dependencies_1.updateSurveyUseCase));
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
router.delete('/:id', (0, deleteSurveyController_1.deleteSurveyController)(dependencies_1.deleteSurveyUseCase));
exports.default = router;
