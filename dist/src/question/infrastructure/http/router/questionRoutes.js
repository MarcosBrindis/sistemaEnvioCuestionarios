"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createQuestionController_1 = require("../controller/createQuestionController");
const updateQuestionController_1 = require("../controller/updateQuestionController");
const deleteQuestionController_1 = require("../controller/deleteQuestionController");
const getQuestionsController_1 = require("../controller/getQuestionsController");
const getQuestionsWithOptionsController_1 = require("../controller/getQuestionsWithOptionsController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/pregunta:
 *   post:
 *     tags:
 *       - Preguntas
 *     summary: Crear una nueva pregunta
 *     description: Crea una pregunta asociándola obligatoriamente a un tipo de pregunta.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreguntaRequest'
 *     responses:
 *       201:
 *         description: Pregunta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreguntaResource'
 *       400:
 *         description: Error en el formato JSON API o falta tipo-pregunta
 */
const createQuestion = (0, createQuestionController_1.createQuestionController)(dependencies_1.dependencies.createQuestion);
/**
 * @openapi
 * /api/pregunta/{id}:
 *   patch:
 *     tags:
 *       - Preguntas
 *     summary: Actualizar una pregunta existente
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
 *             $ref: '#/components/schemas/PreguntaRequest'
 *     responses:
 *       200:
 *         description: Pregunta actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreguntaResource'
 */
const updateQuestion = (0, updateQuestionController_1.updateQuestionController)(dependencies_1.dependencies.updateQuestion);
/**
 * @openapi
 * /api/pregunta/{id}:
 *   delete:
 *     tags:
 *       - Preguntas
 *     summary: Eliminar una pregunta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Pregunta eliminada correctamente (Sin contenido)
 */
const deleteQuestion = (0, deleteQuestionController_1.deleteQuestionController)(dependencies_1.dependencies.deleteQuestion);
/**
 * @openapi
 * /api/pregunta:
 *   get:
 *     tags:
 *       - Preguntas
 *     summary: Obtener todas las preguntas o buscar por texto
 *     parameters:
 *       - in: query
 *         name: texto
 *         schema:
 *           type: string
 *         description: Filtro opcional para buscar dentro del texto de la pregunta
 *     responses:
 *       200:
 *         description: Lista de preguntas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: preguntas
 *                       id:
 *                         type: string
 *                       attributes:
 *                         $ref: '#/components/schemas/PreguntaAttributes'
 *                       relationships:
 *                         type: object
 *                         properties:
 *                           tipo-pregunta:
 *                             type: object
 *                             properties:
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   type:
 *                                     type: string
 *                                     example: tipos-pregunta
 *                                   id:
 *                                     type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     query:
 *                       type: string
 */
const getQuestions = (0, getQuestionsController_1.getQuestionsController)(dependencies_1.dependencies.getAllQuestions, dependencies_1.dependencies.searchQuestionsByText);
router.post('/', createQuestion);
router.get('/', getQuestions);
// Ruta para obtener todas las preguntas con sus opciones (DEBE IR ANTES DE /:id)
const getQuestionsWithOptions = (0, getQuestionsWithOptionsController_1.getQuestionsWithOptionsController)(dependencies_1.dependencies.getQuestionsWithOptions);
/**
 * @openapi
 * /api/pregunta/con-opciones:
 *   get:
 *     tags:
 *       - Preguntas
 *     summary: Obtener todas las preguntas con sus opciones
 *     description: Retorna todas las preguntas del sistema junto con sus opciones asociadas (si las tienen). Incluye el tipo de pregunta y sus opciones en un formato completo.
 *     responses:
 *       200:
 *         description: Lista de preguntas con sus opciones incluidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: preguntas
 *                       id:
 *                         type: string
 *                         example: "101"
 *                       attributes:
 *                         $ref: '#/components/schemas/PreguntaAttributes'
 *                       relationships:
 *                         type: object
 *                         properties:
 *                           tipo-pregunta:
 *                             type: object
 *                             properties:
 *                               data:
 *                                 type: object
 *                                 properties:
 *                                   type:
 *                                     type: string
 *                                     example: tipos-pregunta
 *                                   id:
 *                                     type: string
 *                                     example: "2"
 *                                   nombre:
 *                                     type: string
 *                                     example: Opción Múltiple
 *                       included:
 *                         type: object
 *                         properties:
 *                           opciones:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 type:
 *                                   type: string
 *                                   example: opciones-pregunta
 *                                 id:
 *                                   type: string
 *                                   example: "50"
 *                                 attributes:
 *                                   type: object
 *                                   properties:
 *                                     texto_opcion:
 *                                       type: string
 *                                       example: JavaScript
 *                                     etiqueta:
 *                                       type: string
 *                                       example: A
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 */
router.get('/con-opciones', getQuestionsWithOptions);
/**
 * @openapi
 * /api/pregunta/{id}:
 *   get:
 *     tags:
 *       - Preguntas
 *     summary: Obtener una pregunta por ID (Incluye opciones)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la pregunta con sus opciones (si aplica)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreguntaResource'
 *       404:
 *         description: Pregunta no encontrada
 */
router.get('/:id', getQuestions);
router.patch('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);
exports.default = router;
