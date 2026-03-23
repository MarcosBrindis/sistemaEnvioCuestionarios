"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createAcademicAchievementController_1 = require("../controller/createAcademicAchievementController");
const getAcademicAchievementsController_1 = require("../controller/getAcademicAchievementsController");
const getAcademicAchievementByIdController_1 = require("../controller/getAcademicAchievementByIdController");
const updateAcademicAchievementController_1 = require("../controller/updateAcademicAchievementController");
const deleteAcademicAchievementController_1 = require("../controller/deleteAcademicAchievementController");
const getAcademicAchievementController_1 = require("../controller/getAcademicAchievementController");
const router = (0, express_1.Router)({ mergeParams: true });
/**
 * @openapi
 * /api/egresado/logros-academicos/all:
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Listar todos los logros académicos
 *     responses:
 *       200:
 *         description: Lista de todos los logros académicos
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
 *                         example: logros-academicos
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       attributes:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                             example: "Maestría en Ciencias"
 *                           institucion:
 *                             type: string
 *                             example: "UNAM"
 *                           fecha:
 *                             type: string
 *                             example: "2025-01-01"
 */
router.get('/all', getAcademicAchievementController_1.getAllacademicAchievementController);
/**
 * @openapi
 * /api/egresado/{id}/logros-academicos:
 *   post:
 *     tags:
 *       - Trayectoria
 *     summary: Crear un logro académico para un egresado
 *     responses:
 *       201:
 *         description: Logro académico creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: logros-academicos
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         titulo:
 *                           type: string
 *                           example: "Maestría en Ciencias"
 *                         institucion:
 *                           type: string
 *                           example: "UNAM"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       400:
 *         description: Error de validación o negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: logros-academicos
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       titulo:
 *                         type: string
 *                         example: "Maestría en Ciencias"
 *                       institucion:
 *                         type: string
 *                         example: "UNAM"
 *                       fecha:
 *                         type: string
 *                         example: "2025-01-01"
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Listar logros académicos de un egresado
 *     responses:
 *       200:
 *         description: Lista de logros académicos
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
 *                         example: logros-academicos
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       attributes:
 *                         type: object
 *                         properties:
 *                           titulo:
 *                             type: string
 *                             example: "Maestría en Ciencias"
 *                           institucion:
 *                             type: string
 *                             example: "UNAM"
 *                           fecha:
 *                             type: string
 *                             example: "2025-01-01"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 */
router.post('/', createAcademicAchievementController_1.createAcademicAchievementController);
router.get('/', getAcademicAchievementsController_1.getAcademicAchievementsController);
/**
 * @openapi
 * /api/egresado/{id}/logros-academicos/{idLogro}:
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Obtener un logro académico por ID
 *     responses:
 *       200:
 *         description: Logro académico encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: logros-academicos
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         titulo:
 *                           type: string
 *                           example: "Maestría en Ciencias"
 *                         institucion:
 *                           type: string
 *                           example: "UNAM"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       404:
 *         description: Logro académico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro académico
 *   put:
 *     tags:
 *       - Trayectoria
 *     summary: Actualizar un logro académico
 *     responses:
 *       200:
 *         description: Logro académico actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: logros-academicos
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         titulo:
 *                           type: string
 *                           example: "Maestría en Ciencias"
 *                         institucion:
 *                           type: string
 *                           example: "UNAM"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       400:
 *         description: Error de validación o negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Logro académico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro académico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: logros-academicos
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       titulo:
 *                         type: string
 *                         example: "Maestría en Ciencias"
 *                       institucion:
 *                         type: string
 *                         example: "UNAM"
 *                       fecha:
 *                         type: string
 *                         example: "2025-01-01"
 *   delete:
 *     tags:
 *       - Trayectoria
 *     summary: Eliminar un logro académico
 *     responses:
 *       204:
 *         description: Logro académico eliminado correctamente
 *       404:
 *         description: Logro académico no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro académico
 */
router.get('/:idLogro', getAcademicAchievementByIdController_1.getAcademicAchievementByIdController);
router.put('/:idLogro', updateAcademicAchievementController_1.updateAcademicAchievementController);
router.delete('/:idLogro', deleteAcademicAchievementController_1.deleteAcademicAchievementController);
exports.default = router;
