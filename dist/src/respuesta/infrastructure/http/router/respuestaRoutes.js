"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createRespuestaController_1 = require("../controller/createRespuestaController");
const getRespuestasController_1 = require("../controller/getRespuestasController");
const getRespuestaByIdController_1 = require("../controller/getRespuestaByIdController");
const deleteRespuestaController_1 = require("../controller/deleteRespuestaController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/respuesta:
 *   post:
 *     summary: Registrar una respuesta de egresado a un formulario
 *     tags:
 *       - Respuestas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_egresado:
 *                 type: integer
 *                 example: 1
 *               id_formulario:
 *                 type: integer
 *                 example: 2
 *               respuestas_json:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_pregunta:
 *                       type: integer
 *                       example: 10
 *                     valor:
 *                       type: string
 *                       example: "Respuesta del egresado"
 *     responses:
 *       201:
 *         description: Respuesta registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaResource'
 *       400:
 *         description: Error de validación o negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   get:
 *     summary: Obtener todas las respuestas (filtrable por id_formulario o id_egresado)
 *     tags:
 *       - Respuestas
 *     parameters:
 *       - in: query
 *         name: id_formulario
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del formulario
 *       - in: query
 *         name: id_egresado
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID del egresado
 *     responses:
 *       200:
 *         description: Lista de respuestas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RespuestaResource'
 */
router.post('/', createRespuestaController_1.createRespuestaController);
router.get('/', getRespuestasController_1.getRespuestasController);
/**
 * @openapi
 * /api/respuesta/{id}:
 *   get:
 *     summary: Obtener una respuesta por ID
 *     tags:
 *       - Respuestas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RespuestaResource'
 *       404:
 *         description: Respuesta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   delete:
 *     summary: Eliminar una respuesta por ID
 *     tags:
 *       - Respuestas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Respuesta eliminada correctamente
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:id', getRespuestaByIdController_1.getRespuestaByIdController);
router.delete('/:id', deleteRespuestaController_1.deleteRespuestaController);
exports.default = router;
