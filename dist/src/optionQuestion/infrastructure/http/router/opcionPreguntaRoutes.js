"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createOpcionPreguntaController_1 = require("../controller/createOpcionPreguntaController");
const updateOpcionPreguntaController_1 = require("../controller/updateOpcionPreguntaController");
const deleteOpcionPreguntaController_1 = require("../controller/deleteOpcionPreguntaController");
const getOpcionPreguntasController_1 = require("../controller/getOpcionPreguntasController");
const requestLogger_1 = require("../../../../core/middleware/requestLogger");
const router = (0, express_1.Router)();
router.use(requestLogger_1.requestLogger);
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
const createOpcionPregunta = (0, createOpcionPreguntaController_1.createOpcionPreguntaController)(dependencies_1.dependencies.createOpcionPregunta);
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
const updateOpcionPregunta = (0, updateOpcionPreguntaController_1.updateOpcionPreguntaController)(dependencies_1.dependencies.updateOpcionPregunta);
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
const deleteOpcionPregunta = (0, deleteOpcionPreguntaController_1.deleteOpcionPreguntaController)(dependencies_1.dependencies.deleteOpcionPregunta);
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
const getOpcionesPreguntas = (0, getOpcionPreguntasController_1.getOpcionPreguntasController)(dependencies_1.dependencies.getOpcionPreguntaById, dependencies_1.dependencies.getAllOpcionesPreguntas, dependencies_1.dependencies.getOpcionPreguntasByQuestionId);
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
exports.default = router;
