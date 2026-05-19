"use strict";
/**
 * @openapi
 * /distribution/dispatch:
 *   post:
 *     summary: Despachar recordatorios de encuesta
 *     description: >
 *       Envía correos a los egresados de un grupo específico asignados a una encuesta.
 *       Primero asigna (o reactiva) la relación encuesta-egresado para ese grupo
 *       (creando/reactivando UUIDs en `encuesta_egresados`) y luego despacha los correos.
 *
 *       **IMPORTANTE**: El parámetro `id_group` es OBLIGATORIO. Esto asegura que el envío
 *       sea explícito a un grupo específico, evitando distribuciones accidentales a todos los egresados.
 *     tags:
 *       - Distribution
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_encuesta, id_template, id_group, filtro]
 *             properties:
 *               id_encuesta:
 *                 type: integer
 *                 description: ID de la encuesta a enviar.
 *                 example: 5
 *               id_template:
 *                 type: integer
 *                 description: ID del template de correo a usar.
 *                 example: 10
 *               id_group:
 *                 type: integer
 *                 description: ID del grupo al cual se envía la encuesta. **REQUERIDO**.
 *                 example: 105
 *               filtro:
 *                 type: string
 *                 enum: [todos, pendientes, contestadas]
 *                 description: |
 *                   Filtra participantes según su estado de respuesta:
 *                   - `todos`: incluye todos los asignados.
 *                   - `pendientes`: sin respuesta registrada.
 *                   - `contestadas`: con respuesta registrada.
 *                 example: pendientes
 *           examples:
 *             dispatchGroup:
 *               summary: Despacho a grupo con filtro pendientes
 *               value:
 *                 id_encuesta: 5
 *                 id_template: 10
 *                 id_group: 105
 *                 filtro: pendientes
 *     responses:
 *       200:
 *         description: Despacho completado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     survey_id:
 *                       type: integer
 *                     target_filter:
 *                       type: string
 *                     total_participants:
 *                       type: integer
 *                     batches_processed:
 *                       type: integer
 *                     message:
 *                       type: string
 *       400:
 *         description: Bad Request. id_group es requerido.
 */
/**
 * @openapi
 * /distribution/dispatch-birthday:
 *   post:
 *     summary: Ejecutar envio manual de felicitaciones de cumpleaños
 *     description: >
 *       Dispara manualmente el proceso de envio de correos de cumpleaños para los egresados
 *       que cumplen hoy. Este endpoint es util para pruebas o ejecuciones puntuales fuera del cron.
 *     tags:
 *       - Distribution
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_template:
 *                 type: integer
 *                 description: ID de template de cumpleaños. Si no se envia, usa BIRTHDAY_TEMPLATE_ID.
 *                 example: 150001
 *               reference_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de referencia para buscar cumpleaños (YYYY-MM-DD).
 *                 example: 2026-03-31
 *     responses:
 *       200:
 *         description: Envio de cumpleaños ejecutado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     mode:
 *                       type: string
 *                       enum: [birthday-date, test]
 *                     date:
 *                       type: string
 *                     template_id:
 *                       type: integer
 *                     total_participants:
 *                       type: integer
 *                     sent:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     message:
 *                       type: string
 *       500:
 *         description: Error al ejecutar el envio de cumpleaños
 */
/**
 * @openapi
 * /distribution/dispatch-birthday-test:
 *   post:
 *     summary: Ejecutar envio de prueba de felicitaciones de cumpleaños
 *     description: >
 *       Ejecuta un envio aislado a destinatarios de prueba sin depender de que cumplan años hoy.
 *       Se puede indicar lista de `target_egresado_ids`, `target_emails` o ambas.
 *     tags:
 *       - Distribution
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_template:
 *                 type: integer
 *                 description: ID de template de cumpleaños. Si no se envia, usa BIRTHDAY_TEMPLATE_ID.
 *                 example: 150001
 *               target_egresado_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: IDs de egresado para pruebas.
 *                 example: [1001, 1002]
 *               target_emails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: email
 *                 description: Correos de egresados para pruebas.
 *                 example: ["qa1@example.com", "qa2@example.com"]
 *             anyOf:
 *               - required: [target_egresado_ids]
 *               - required: [target_emails]
 *     responses:
 *       200:
 *         description: Envio de prueba ejecutado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     mode:
 *                       type: string
 *                       enum: [birthday-date, test]
 *                     date:
 *                       type: string
 *                     template_id:
 *                       type: integer
 *                     total_participants:
 *                       type: integer
 *                     sent:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     message:
 *                       type: string
 *       500:
 *         description: Error al ejecutar el envio de prueba
 */
