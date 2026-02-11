import { Router } from 'express';
import { dependencies } from '../../../infrastructure/dependencies';
import { createDatosDomiciliariosController } from '../controller/createDatosDomiciliariosController';
import { getDatosDomiciliariosController } from '../controller/getDatosDomiciliariosController';
import { updateDatosDomiciliariosController } from '../controller/updateDatosDomiciliariosController';
import { deleteDatosDomiciliariosController } from '../controller/deleteDatosDomiciliariosController';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();
router.use(requestLogger);

/**
 * @openapi
 * /api/datos-domiciliarios:
 *   post:
 *     tags:
 *       - Datos Domiciliarios
 *     summary: Registrar datos domiciliarios del egresado autenticado
 *     description: |
 *       Permite que un egresado registre por primera vez sus datos domiciliarios.
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
 *                     example: datos-domiciliarios
 *                   attributes:
 *                     type: object
 *                     required:
 *                       - calle
 *                       - colonia
 *                       - numero_exterior
 *                       - codigo_postal
 *                       - estado
 *                       - ciudad
 *                     properties:
 *                       calle:
 *                         type: string
 *                         example: Av. Insurgentes
 *                       colonia:
 *                         type: string
 *                         example: Centro
 *                       numero_exterior:
 *                         type: string
 *                         example: 123
 *                       codigo_postal:
 *                         type: string
 *                         example: 80000
 *                       estado:
 *                         type: string
 *                         example: Chiapas
 *                       ciudad:
 *                         type: string
 *                         example: Suchiapa
 *     responses:
 *       201:
 *         description: Datos domiciliarios creados exitosamente
 *       400:
 *         description: Faltan campos requeridos
 *       401:
 *         description: No autenticado
 *       409:
 *         description: El egresado ya tiene datos domiciliarios registrados
 */
router.post(
  '/',
  createDatosDomiciliariosController(dependencies.createDatosDomiciliarios)
);

/**
 * @openapi
 * /api/datos-domiciliarios:
 *   get:
 *     tags:
 *       - Datos Domiciliarios
 *     summary: Obtener datos domiciliarios del egresado autenticado
 *     description: Retorna los datos domiciliarios del egresado que está en sesión
 *     responses:
 *       200:
 *         description: Datos domiciliarios encontrados
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos domiciliarios
 */
router.get(
  '/',
  getDatosDomiciliariosController(dependencies.getDatosDomiciliariosByEgresado)
);

/**
 * @openapi
 * /api/datos-domiciliarios:
 *   patch:
 *     tags:
 *       - Datos Domiciliarios
 *     summary: Actualizar datos domiciliarios del egresado autenticado
 *     description: |
 *       Permite actualizar parcialmente los datos domiciliarios del egresado.
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
 *                     example: datos-domiciliarios
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       calle:
 *                         type: string
 *                         example: Av. Insurgentes
 *                       colonia:
 *                         type: string
 *                         example: Centro
 *                       numero_exterior:
 *                         type: string
 *                         example: 123
 *                       codigo_postal:
 *                         type: string
 *                         example: 80000
 *                       estado:
 *                         type: string
 *                         example: Sinaloa
 *                       ciudad:
 *                         type: string
 *                         example: Culiacán
 *     responses:
 *       200:
 *         description: Datos domiciliarios actualizados exitosamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos domiciliarios para actualizar
 */
router.patch(
  '/',
  updateDatosDomiciliariosController(dependencies.updateDatosDomiciliarios)
);

/**
 * @openapi
 * /api/datos-domiciliarios:
 *   delete:
 *     tags:
 *       - Datos Domiciliarios
 *     summary: Eliminar datos domiciliarios del egresado autenticado
 *     description: Elimina los datos domiciliarios del egresado en sesión
 *     responses:
 *       204:
 *         description: Datos domiciliarios eliminados exitosamente
 *       401:
 *         description: No autenticado
 *       404:
 *         description: No se encontraron datos domiciliarios para eliminar
 */
router.delete(
  '/',
  deleteDatosDomiciliariosController(dependencies.deleteDatosDomiciliarios)
);

export default router;
