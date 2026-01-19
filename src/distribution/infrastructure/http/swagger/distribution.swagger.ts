/**
 * @openapi
 * /distribution/dispatch:
 *   post:
 *     summary: Despachar recordatorios de encuesta
 *     tags:
 *       - Distribution
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_encuesta, id_template, filtro]
 *             properties:
 *               id_encuesta:
 *                 type: integer
 *                 example: 5
 *               id_template:
 *                 type: integer
 *                 example: 10
 *               filtro:
 *                 type: string
 *                 enum: [todos, pendientes, contestadas]
 *                 example: pendientes
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
