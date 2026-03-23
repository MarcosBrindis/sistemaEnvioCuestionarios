"use strict";
/**
 * @openapi
 * /distribution/dispatch:
 *   post:
 *     summary: Despachar recordatorios de encuesta
 *     description: >
 *       Envía correos a los egresados asignados a una encuesta. Si se envía `id_group`,
 *       primero genera (o reactiva) la relación encuesta-egresado para ese grupo
 *       (creando UUIDs en `encuesta_egresados`) y luego despacha los correos.
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
 *                 description: ID del grupo desde el cual se asignan egresados a la encuesta.
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
 */
