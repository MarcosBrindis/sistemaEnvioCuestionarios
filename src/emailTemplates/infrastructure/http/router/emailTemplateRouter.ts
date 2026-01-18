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
 *     tags: [EmailTemplates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailTemplateInput'
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
