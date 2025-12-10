import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { syncEgresadosController } from '../controller/syncEgresadosController';
import laborAchievementRoutes from '../../../../laborAchievement/infrastructure/http/router/laborAchievementRoutes';
import academicAchievementRoutes from '../../../../academicAchievement/infrastructure/http/router/academicAchievementRoutes';
import { requestLogger } from '../../../../core/middleware/requestLogger';

const router = Router();
router.use(requestLogger);

/**
 * @openapi
 * /api/egresados/sync:
 *   post:
 *     tags:
 *       - Egresados
 *     summary: Sincronizar egresados desde el servicio externo Platinum
 *     description: |
 *       Obtiene egresados del servicio externo Platinum y los sincroniza con la base de datos local.
 *       Solo inserta nuevos egresados, no actualiza los existentes.
 *       
 *       Parámetros opcionales de filtro (query parameters):
 *       - programa: Filtrar por programa educativo
 *       - matricula_like: Filtrar por matrícula (cohorte)
 *       - periodo: Filtrar por periodo específico
 *       - periodo_from: Filtrar desde periodo
 *       - periodo_to: Filtrar hasta periodo
 *     parameters:
 *       - in: query
 *         name: programa
 *         schema:
 *           type: string
 *         description: ID del programa educativo para filtrar
 *       - in: query
 *         name: matricula_like
 *         schema:
 *           type: string
 *         description: Matrícula (cohorte) para filtrar
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Periodo específico para filtrar
 *       - in: query
 *         name: periodo_from
 *         schema:
 *           type: string
 *         description: Periodo desde para filtrar
 *       - in: query
 *         name: periodo_to
 *         schema:
 *           type: string
 *         description: Periodo hasta para filtrar
 *     responses:
 *       200:
 *         description: Sincronización completada con resumen
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
 *                       example: integracion
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           enum: [completado, parcial, fallido]
 *                         resumen:
 *                           type: object
 *                           properties:
 *                             periodos_nuevos:
 *                               type: integer
 *                               example: 1
 *                             egresados_procesados_total:
 *                               type: integer
 *                               example: 150
 *                             nuevos_insertados:
 *                               type: integer
 *                               example: 25
 *                             existentes_ignorados:
 *                               type: integer
 *                               example: 125
 *                 meta:
 *                   type: object
 *                   properties:
 *                     programas_nuevos:
 *                       type: integer
 *                       example: 2
 *                     errores:
 *                       type: integer
 *                       example: 0
 *       502:
 *         description: Error al conectar con el servicio externo
 */
const syncEgresados = syncEgresadosController(dependencies.syncEgresadosFromPlatinum);

router.post('/sync', syncEgresados);

// Rutas para gestión de trayectoria (logros)
router.use('/:id/logros-laborales', laborAchievementRoutes);
router.use('/:id/logros-academicos', academicAchievementRoutes);

export default router;