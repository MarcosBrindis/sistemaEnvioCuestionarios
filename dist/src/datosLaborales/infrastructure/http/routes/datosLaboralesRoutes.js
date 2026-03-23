"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const createDatosLaboralesController_1 = require("../controller/createDatosLaboralesController");
const getDatosLaboralesController_1 = require("../controller/getDatosLaboralesController");
const updateDatosLaboralesController_1 = require("../controller/updateDatosLaboralesController");
const deleteDatosLaboralesController_1 = require("../controller/deleteDatosLaboralesController");
const requestLogger_1 = require("../../../../core/middleware/requestLogger");
const router = (0, express_1.Router)();
router.use(requestLogger_1.requestLogger);
/**
 * @openapi
 * /api/datos-laborales:
 *   post:
 *     tags:
 *       - Datos Laborales
 *     summary: Registrar datos laborales del egresado autenticado
 *     description: |
 *       Permite que un egresado registre por primera vez sus datos laborales.
 *       Si ya tiene datos registrados, debe usar el endpoint de actualización.
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
 *                     example: datos-laborales
 *                   attributes:
 *                     type: object
 *                     required:
 *                       - trabaja_actualmente
 *                     properties:
 *                       trabaja_actualmente:
 *                         type: boolean
 *                         example: true
 *                       nombre_empresa:
 *                         type: string
 *                         nullable: true
 *                         example: Google México
 *                       puesto:
 *                         type: string
 *                         nullable: true
 *                         example: Desarrollador de Software
 *                       id_sector:
 *                         type: integer
 *                         nullable: true
 *                         example: 9
 *                         description: ID del sector económico (1-10). Ver GET /api/sectores-economicos para consultar disponibles
 *                       actividad_principal:
 *                         type: string
 *                         nullable: true
 *                         example: Desarrollo de aplicaciones web y móvil
 *     responses:
 *       201:
 *         description: Datos laborales creados exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: No autenticado
 *       409:
 *         description: El egresado ya tiene datos laborales registrados
 */
router.post('/', (0, createDatosLaboralesController_1.createDatosLaboralesController)(dependencies_1.dependencies.createDatosLaborales));
/**
 * @openapi
 * /api/datos-laborales:
 *   get:
 *     tags:
 *       - Datos Laborales
 *     summary: Obtener datos laborales del egresado autenticado
 *     description: Retorna los datos laborales del egresado que está en sesión
 *     responses:
 *       200:
 *         description: Datos laborales encontrados
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos laborales
 */
router.get('/', (0, getDatosLaboralesController_1.getDatosLaboralesController)(dependencies_1.dependencies.getDatosLaboralesByEgresado));
/**
 * @openapi
 * /api/datos-laborales:
 *   patch:
 *     tags:
 *       - Datos Laborales
 *     summary: Actualizar datos laborales del egresado autenticado
 *     description: |
 *       Permite actualizar parcialmente los datos laborales del egresado.
 *       Solo se actualizan los campos enviados en el body.
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
 *                     example: datos-laborales
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       trabaja_actualmente:
 *                         type: boolean
 *                         example: true
 *                       nombre_empresa:
 *                         type: string
 *                         nullable: true
 *                         example: Google México
 *                       puesto:
 *                         type: string
 *                         nullable: true
 *                         example: Desarrollador Senior
 *                       id_sector:
 *                         type: integer
 *                         nullable: true
 *                         example: 9
 *                         description: ID del sector económico (1-10)
 *                       actividad_principal:
 *                         type: string
 *                         nullable: true
 *                         example: Liderar equipo de desarrollo
 *     responses:
 *       200:
 *         description: Datos laborales actualizados exitosamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos laborales para actualizar
 */
router.patch('/', (0, updateDatosLaboralesController_1.updateDatosLaboralesController)(dependencies_1.dependencies.updateDatosLaborales));
/**
 * @openapi
 * /api/datos-laborales:
 *   delete:
 *     tags:
 *       - Datos Laborales
 *     summary: Eliminar datos laborales del egresado autenticado
 *     description: Elimina los datos laborales del egresado en sesión
 *     responses:
 *       204:
 *         description: Datos laborales eliminados exitosamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos laborales para eliminar
 */
router.delete('/', (0, deleteDatosLaboralesController_1.deleteDatosLaboralesController)(dependencies_1.dependencies.deleteDatosLaborales));
exports.default = router;
