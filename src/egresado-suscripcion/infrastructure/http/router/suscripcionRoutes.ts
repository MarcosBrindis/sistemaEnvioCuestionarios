import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { unsubscribeEgresadoController } from '../controller/unsubscribeEgresadoController';
import { resubscribeEgresadoController } from '../controller/resubscribeEgresadoController';
import { authEgresado } from '../../../../core/middleware/authEgresado';

const router = Router();

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
router.post('/egresados/unsubscribe', authEgresado, unsubscribeEgresadoController(dependencies.unsubscribeEgresado));
router.post('/egresados/resubscribe', authEgresado, resubscribeEgresadoController(dependencies.resubscribeEgresado));

export default router;
