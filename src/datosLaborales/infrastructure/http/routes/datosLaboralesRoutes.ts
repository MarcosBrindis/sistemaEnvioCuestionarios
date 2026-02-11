import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { createDatosLaboralesController } from '../controller/createDatosLaboralesController';
import { getDatosLaboralesController } from '../controller/getDatosLaboralesController';
import { updateDatosLaboralesController } from '../controller/updateDatosLaboralesController';
import { deleteDatosLaboralesController } from '../controller/deleteDatosLaboralesController';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();
router.use(requestLogger);

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
router.post(
  '/',
  createDatosLaboralesController(dependencies.createDatosLaborales)
);

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
router.get(
  '/',
  getDatosLaboralesController(dependencies.getDatosLaboralesByEgresado)
);

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
router.patch(
  '/',
  updateDatosLaboralesController(dependencies.updateDatosLaborales)
);

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
router.delete(
  '/',
  deleteDatosLaboralesController(dependencies.deleteDatosLaborales)
);

export default router;
