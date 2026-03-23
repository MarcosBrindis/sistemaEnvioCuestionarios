"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createTipoCorreoController_1 = require("../controller/createTipoCorreoController");
const getTiposCorreoController_1 = require("../controller/getTiposCorreoController");
const updateTipoCorreoController_1 = require("../controller/updateTipoCorreoController");
const deleteTipoCorreoController_1 = require("../controller/deleteTipoCorreoController");
const getTipoCorreoByIdController_1 = require("../controller/getTipoCorreoByIdController");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/tipo-correo:
 *   post:
 *     tags:
 *       - Tipos de Correo
 *     summary: Crear un nuevo tipo de correo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoCorreoRequest'
 *     responses:
 *       201:
 *         description: Tipo de correo creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoCorreoResource'
 *       400:
 *         description: Error de formato JSON API
 */
router.post('/tipo-correo', (0, createTipoCorreoController_1.createTipoCorreoController)(dependencies_1.dependencies.createTipoCorreo));
/**
 * @openapi
 * /api/tipo-correo/{id}:
 *   patch:
 *     tags:
 *       - Tipos de Correo
 *     summary: Actualizar un tipo de correo existente
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
 *             $ref: '#/components/schemas/TipoCorreoRequest'
 *     responses:
 *       200:
 *         description: Tipo de correo actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoCorreoResource'
 *       400:
 *         description: Error de formato JSON API
 */
router.patch('/tipo-correo/:id', (0, updateTipoCorreoController_1.updateTipoCorreoController)(dependencies_1.dependencies.updateTipoCorreo));
/**
 * @openapi
 * /api/tipo-correo/{id}:
 *   delete:
 *     tags:
 *       - Tipos de Correo
 *     summary: Eliminar un tipo de correo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Tipo de correo eliminado exitosamente
 *       400:
 *         description: No se puede eliminar el tipo de correo si está en uso
 */
router.delete('/tipo-correo/:id', (0, deleteTipoCorreoController_1.deleteTipoCorreoController)(dependencies_1.dependencies.deleteTipoCorreo));
/**
 * @openapi
 * /api/tipo-correo/{id}:
 *   get:
 *     tags:
 *       - Tipos de Correo
 *     summary: Obtener un tipo de correo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tipo de correo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoCorreoResource'
 *       404:
 *         description: Tipo de correo no encontrado
 */
router.get('/tipo-correo/:id', (0, getTipoCorreoByIdController_1.getTipoCorreoByIdController)(dependencies_1.dependencies.getTipoCorreoById));
/**
 * @openapi
 * /api/tipo-correo:
 *   get:
 *     tags:
 *       - Tipos de Correo
 *     summary: Obtener todos los tipos de correo
 *     responses:
 *       200:
 *         description: Lista de tipos de correo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoCorreoResource'
 */
router.get('/tipo-correo', (0, getTiposCorreoController_1.getTiposCorreoController)(dependencies_1.dependencies.getTiposCorreo));
exports.default = router;
