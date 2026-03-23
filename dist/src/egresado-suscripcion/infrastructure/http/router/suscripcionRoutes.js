"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dependencies_1 = require("../../dependencies");
const unsubscribeEgresadoController_1 = require("../controller/unsubscribeEgresadoController");
const resubscribeEgresadoController_1 = require("../controller/resubscribeEgresadoController");
const authEgresado_1 = require("../../../../core/middleware/authEgresado");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/egresados/unsubscribe:
 *   post:
 *     tags:
 *       - Suscripción Egresados
 *     summary: Darse de baja de correos y encuestas
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
 *                     example: suscripcion
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       accion:
 *                         type: string
 *                         example: unsubscribe
 *                       motivo:
 *                         type: string
 *                         example: Exceso de correos
 *     responses:
 *       200:
 *         description: Baja exitosa
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
 *                     id:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         mensaje:
 *                           type: string
 *                         is_active:
 *                           type: boolean
 *                         estado_actual:
 *                           type: string
 */
/**
 * @openapi
 * /api/egresados/resubscribe:
 *   post:
 *     tags:
 *       - Suscripción Egresados
 *     summary: Volver a suscribirse a correos y encuestas
 *     responses:
 *       200:
 *         description: Reactivación exitosa
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
 *                     id:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         mensaje:
 *                           type: string
 *                         is_active:
 *                           type: boolean
 *                         estado_actual:
 *                           type: string
 */
router.post('/egresados/unsubscribe', authEgresado_1.authEgresado, (0, unsubscribeEgresadoController_1.unsubscribeEgresadoController)(dependencies_1.dependencies.unsubscribeEgresado));
router.post('/egresados/resubscribe', authEgresado_1.authEgresado, (0, resubscribeEgresadoController_1.resubscribeEgresadoController)(dependencies_1.dependencies.resubscribeEgresado));
exports.default = router;
