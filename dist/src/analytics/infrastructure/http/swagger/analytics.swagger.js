"use strict";
/**
 * @openapi
 * /analytics/survey/{id_encuesta}:
 *   get:
 *     summary: Obtener estadísticas de una encuesta
 *     tags:
 *       - Analytics
 *     parameters:
 *       - name: id_encuesta
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte de estadísticas generado
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
 *                     meta:
 *                       type: object
 *                       properties:
 *                         title:
 *                           type: string
 *                         description:
 *                           type: string
 *                           nullable: true
 *                         total_responses:
 *                           type: integer
 *                     charts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           question_id:
 *                             type: string
 *                           label:
 *                             type: string
 *                           chart_type:
 *                             type: string
 *                           dataset:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 label:
 *                                   type: string
 *                                 count:
 *                                   type: integer
 */
