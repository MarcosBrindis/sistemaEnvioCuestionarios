import { Router } from 'express';
import { automaticEventsController } from '../../dependencies';
import { requireAuth, requireRoles } from '../../../../core/middleware/authorization';

const router = Router();

router.use(requireAuth, requireRoles(['super_admin', 'director_vinculacion']));

/**
 * @openapi
 * /api/automatic-events:
 *   post:
 *     tags:
 *       - Automatic Events
 *     summary: Crear un evento automatico
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, event_type, cron_expression, timezone, payload]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Cumpleanos diario 9am
 *               event_type:
 *                 type: string
 *                 enum: [birthday_dispatch, survey_dispatch]
 *                 example: birthday_dispatch
 *               cron_expression:
 *                 type: string
 *                 example: 0 9 * * *
 *               timezone:
 *                 type: string
 *                 example: America/Mexico_City
 *               is_active:
 *                 type: boolean
 *                 example: true
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               next_run_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               payload:
 *                 type: object
 *                 description: |
 *                   Si event_type=birthday_dispatch: { id_template, reference_date? }
 *                   Si event_type=survey_dispatch: { id_encuesta, id_template, filtro, id_group? }
 *                 oneOf:
 *                   - type: object
 *                     required: [id_template]
 *                     properties:
 *                       id_template:
 *                         type: integer
 *                         example: 150001
 *                       reference_date:
 *                         type: string
 *                         format: date
 *                         example: 2026-04-21
 *                   - type: object
 *                     required: [id_encuesta, id_template, filtro]
 *                     properties:
 *                       id_encuesta:
 *                         type: integer
 *                         example: 5
 *                       id_template:
 *                         type: integer
 *                         example: 10
 *                       filtro:
 *                         type: string
 *                         enum: [todos, pendientes, contestadas]
 *                         example: pendientes
 *                       id_group:
 *                         type: integer
 *                         example: 105
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 *       400:
 *         description: Datos invalidos
 */
router.post('/', automaticEventsController.create.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events:
 *   get:
 *     tags:
 *       - Automatic Events
 *     summary: Listar eventos automaticos
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos automaticos
 */
router.get('/', automaticEventsController.list.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}:
 *   get:
 *     tags:
 *       - Automatic Events
 *     summary: Obtener detalle de evento automatico
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id', automaticEventsController.getById.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}:
 *   patch:
 *     tags:
 *       - Automatic Events
 *     summary: Actualizar evento automatico
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               event_type:
 *                 type: string
 *                 enum: [birthday_dispatch, survey_dispatch]
 *               cron_expression:
 *                 type: string
 *               timezone:
 *                 type: string
 *               starts_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               ends_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               next_run_at:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               payload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/:id', automaticEventsController.update.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}/activate:
 *   patch:
 *     tags:
 *       - Automatic Events
 *     summary: Activar evento automatico
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico
 *     responses:
 *       200:
 *         description: Evento activado
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/:id/activate', automaticEventsController.activate.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}/deactivate:
 *   patch:
 *     tags:
 *       - Automatic Events
 *     summary: Desactivar evento automatico
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico
 *     responses:
 *       200:
 *         description: Evento desactivado
 *       404:
 *         description: Evento no encontrado
 */
router.patch('/:id/deactivate', automaticEventsController.deactivate.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}/trigger:
 *   post:
 *     tags:
 *       - Automatic Events
 *     summary: Ejecutar manualmente evento automatico
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico a ejecutar manualmente
 *     responses:
 *       200:
 *         description: Ejecucion iniciada y completada
 *       404:
 *         description: Evento no encontrado
 */
router.post('/:id/trigger', automaticEventsController.trigger.bind(automaticEventsController));

/**
 * @openapi
 * /api/automatic-events/{id}/runs:
 *   get:
 *     tags:
 *       - Automatic Events
 *     summary: Listar historial de ejecuciones del evento
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento automatico
 *     responses:
 *       200:
 *         description: Historial de ejecuciones
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id/runs', automaticEventsController.listRuns.bind(automaticEventsController));

export default router;
