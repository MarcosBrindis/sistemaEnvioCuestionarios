"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createFormController_1 = require("../controller/createFormController");
const getFormController_1 = require("../controller/getFormController");
const updateFormController_1 = require("../controller/updateFormController");
const deleteFormController_1 = require("../controller/deleteFormController");
const addQuestionController_1 = require("../controller/addQuestionController");
const removeQuestionController_1 = require("../controller/removeQuestionController");
const requestLogger_1 = require("../../../../core/middleware/requestLogger");
const router = (0, express_1.Router)();
router.use(requestLogger_1.requestLogger);
// ...otras rutas...
const getQuestionsWithOptionsController_1 = require("../controller/getQuestionsWithOptionsController");
router.get('/api/formulario/:id/preguntas', getQuestionsWithOptionsController_1.getQuestionsWithOptionsController);
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
const createFormulario = (0, createFormController_1.createFormularioController)(dependencies_1.dependencies.createFormulario);
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
const getFormularios = (0, getFormController_1.getFormulariosController)(dependencies_1.dependencies.getAllFormularios, dependencies_1.dependencies.getFormularioById);
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
const updateFormulario = (0, updateFormController_1.updateFormularioController)(dependencies_1.dependencies.updateFormulario);
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
const deleteFormulario = (0, deleteFormController_1.deleteFormularioController)(dependencies_1.dependencies.deleteFormulario);
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
const addPregunta = (0, addQuestionController_1.addPreguntaController)(dependencies_1.dependencies.addQuestionToFormulario);
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
const removePregunta = (0, removeQuestionController_1.removePreguntaController)(dependencies_1.dependencies.removeQuestionFromFormulario);
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
/**
 * @openapi
 * /api/formulario/{id}/preguntas:
 *   get:
 *     tags:
 *       - Formularios
 *     summary: Obtener todas las preguntas y sus opciones asociadas a un formulario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Listado de preguntas y opciones del formulario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/:id/preguntas', getQuestionsWithOptionsController_1.getQuestionsWithOptionsController);
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
router.get('/pregunta/:preguntaId/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const count = yield dependencies_1.dependencies.formularioRepo.countFormsByQuestionId(preguntaId);
        res.status(200).json({
            meta: {
                preguntaId: preguntaId.toString(),
                formularios_count: count
            }
        });
    }
    catch (error) {
        res.status(500).json({
            error: {
                status: '500',
                title: 'Server Error',
                detail: error.message
            }
        });
    }
}));
exports.default = router;
