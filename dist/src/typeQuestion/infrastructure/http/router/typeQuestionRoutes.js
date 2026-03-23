"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createTypeQuestionController_1 = require("../controller/createTypeQuestionController");
const updateTypeQuestionController_1 = require("../controller/updateTypeQuestionController");
const deleteTypeQuestionController_1 = require("../controller/deleteTypeQuestionController");
const getTypeQuestionsController_1 = require("../controller/getTypeQuestionsController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/tipo-pregunta:
 *   post:
 *     tags:
 *       - Tipos de Pregunta
 *     summary: Crear un nuevo tipo de pregunta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TypeQuestionRequest'
 *     responses:
 *       201:
 *         description: Tipo de pregunta creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeQuestionResource'
 *       400:
 *         description: Error de formato JSON API
 */
const createTypeQuestion = (0, createTypeQuestionController_1.createTypeQuestionController)(dependencies_1.dependencies.createTypeQuestion);
/**
 * @openapi
 * /api/tipo-pregunta/{id}:
 *   patch:
 *     tags:
 *       - Tipos de Pregunta
 *     summary: Actualizar un tipo de pregunta existente
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
 *             $ref: '#/components/schemas/TypeQuestionRequest'
 *     responses:
 *       200:
 *         description: Tipo de pregunta actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeQuestionResource'
 */
const updateTypeQuestion = (0, updateTypeQuestionController_1.updateTypeQuestionController)(dependencies_1.dependencies.updateTypeQuestion);
/**
 * @openapi
 * /api/tipo-pregunta/{id}:
 *   delete:
 *     tags:
 *       - Tipos de Pregunta
 *     summary: Eliminar un tipo de pregunta
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
const deleteTypeQuestion = (0, deleteTypeQuestionController_1.deleteTypeQuestionController)(dependencies_1.dependencies.deleteTypeQuestion);
/**
 * @openapi
 * /api/tipo-pregunta:
 *   get:
 *     tags:
 *       - Tipos de Pregunta
 *     summary: Obtener todos los tipos de pregunta
 *     responses:
 *       200:
 *         description: Lista de tipos de pregunta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TypeQuestionResource'
 */
const getTypeQuestions = (0, getTypeQuestionsController_1.getTypeQuestionsController)(dependencies_1.dependencies.getTypeQuestionById, dependencies_1.dependencies.getAllTypeQuestions);
router.post('/', createTypeQuestion);
router.get('/', getTypeQuestions);
/**
 * @openapi
 * /api/tipo-pregunta/{id}:
 *   get:
 *     tags:
 *       - Tipos de Pregunta
 *     summary: Obtener un tipo de pregunta por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del tipo de pregunta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TypeQuestionResource'
 *       404:
 *         description: Tipo de pregunta no encontrado
 */
router.get('/:id', getTypeQuestions);
router.patch('/:id', updateTypeQuestion);
router.delete('/:id', deleteTypeQuestion);
exports.default = router;
