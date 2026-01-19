/**
 * @openapi
 * /mailing/send:
 *   post:
 *     summary: Enviar correo (en cola)
 *     tags:
 *       - Mailing - Sender
 *     parameters:
 *       - name: x-api-key
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [to, subject]
 *             properties:
 *               to:
 *                 type: string
 *                 example: destinatario@ejemplo.com
 *               subject:
 *                 type: string
 *                 example: Bienvenido a la Encuesta de Egresados
 *               html:
 *                 type: string
 *                 example: "<h1>Hola!</h1> <p>Por favor contesta la encuesta <a href='...'>aquí</a>.</p>"
 *               text:
 *                 type: string
 *                 example: "Hola! Por favor contesta la encuesta en el siguiente enlace: ..."
 *     responses:
 *       202:
 *         description: Correo encolado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     job_id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: queued
 *                     message:
 *                       type: string
 */
