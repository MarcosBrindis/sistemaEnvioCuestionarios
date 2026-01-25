import { Router } from 'express';

import { createEmailTemplateController } from '../controller/createEmailTemplateController';
import { getEmailTemplatesController } from '../controller/getEmailTemplatesController';
import { getEmailTemplateByIdController } from '../controller/getEmailTemplateByIdController';
import { updateEmailTemplateController } from '../controller/updateEmailTemplateController';
import { deleteEmailTemplateController } from '../controller/deleteEmailTemplateController';
import { createEmailTemplate, getEmailTemplates, getEmailTemplateById, updateEmailTemplate, deleteEmailTemplate } from '../../dependencies';

const router = Router();

/**
 * @swagger
 * /api/templates-correo:
 *   post:
 *     summary: Create a new email template
 *     description: >
 *       Crea una plantilla con asunto, contenido editable (`cuerpo`) y un marco inmutable (`layout_html`).
 *       El `layout_html` debe incluir {{DYNAMIC_CONTENT}} para inyectar el `cuerpo`.
 *     tags: [EmailTemplates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplateInput'
 *           examples:
 *             templateSplit:
 *               summary: Plantilla con marco y contenido editable
 *               value:
 *                 data:
 *                   type: templates-correo
 *                   attributes:
 *                     asunto: Encuesta de Seguimiento 2026
 *                     cuerpo: "<h1>Estimado {{nombre_completo}}</h1><p>Gracias por ayudarnos.</p><p>Tu opinión es muy importante.</p>"
 *                     layout_html: "<html><body style='background:#f5f5f5;padding:20px;'><div style='max-width:600px;margin:auto;background:#fff;padding:24px;border-radius:8px;'><img src='https://tu-dominio/logo.png' alt='Logo' style='height:40px;'/><div style='margin-top:16px;'>{{DYNAMIC_CONTENT}}</div><div style='margin-top:24px;text-align:center;'><a href='{{link_encuesta}}' style='background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;'>Ir a la encuesta</a></div><p style='font-size:12px;color:#999;margin-top:24px;'>Correo automático, no responder.</p></div></body></html>"
 *                   relationships:
 *                     tipo_correo:
 *                       data:
 *                         type: tipo_correo
 *                         id: "1"
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post('/', createEmailTemplateController(createEmailTemplate));

/**
 * @swagger
 * /api/templates-correo:
 *   get:
 *     summary: Get all email templates
 *     tags: [EmailTemplates]
 *     responses:
 *       200:
 *         description: List of email templates
 */
router.get('/', getEmailTemplatesController(getEmailTemplates));

/**
 * @swagger
 * /api/templates-correo/{id}:
 *   get:
 *     summary: Get email template by ID
 *     tags: [EmailTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the template
 *     responses:
 *       200:
 *         description: Email template found
 *       404:
 *         description: Not found
 */
router.get('/:id', getEmailTemplateByIdController(getEmailTemplateById));

/**
 * @swagger
 * /api/templates-correo/{id}:
 *   put:
 *     summary: Update an email template
 *     tags: [EmailTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplateInput'
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 */
router.put('/:id', updateEmailTemplateController(updateEmailTemplate));

/**
 * @swagger
 * /api/templates-correo/{id}:
 *   delete:
 *     summary: Delete an email template
 *     tags: [EmailTemplates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the template
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found or cannot delete
 */
router.delete('/:id', deleteEmailTemplateController(deleteEmailTemplate));

export default router;
