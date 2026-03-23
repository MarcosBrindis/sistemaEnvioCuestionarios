"use strict";
/**
 * @openapi
 * # Módulo de Cuentas de Correo SMTP (Mailing)
 * # Instrucciones generales:
 * # - Todos los endpoints requieren autenticación JWT.
 * # - El campo password es de solo escritura y nunca se devuelve en las respuestas.
 * # - Los endpoints soportan actualización parcial y rotación de contraseña.
 *
 * components:
 *   schemas:
 *     EmailAccountInput:
 *       description: Datos para registrar una nueva cuenta SMTP.
 *       type: object
 *       required: [email, password, host, port, daily_limit]
 *       properties:
 *         email:
 *           type: string
 *           example: conecta01@upchiapas.edu.mx
 *         password:
 *           type: string
 *           example: mi_contraseña_super_segura
 *         host:
 *           type: string
 *           example: smtp.gmail.com
 *         port:
 *           type: integer
 *           example: 587
 *         daily_limit:
 *           type: integer
 *           example: 500
 *     EmailAccountResponse:
 *       description: Respuesta de cuenta SMTP (sin password).
 *       type: object
 *       properties:
 *         id_account:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: conecta01@upchiapas.edu.mx
 *         host:
 *           type: string
 *           example: smtp.gmail.com
 *         port:
 *           type: integer
 *           example: 587
 *         daily_limit:
 *           type: integer
 *           example: 500
 *         current_usage:
 *           type: integer
 *           example: 0
 *         is_active:
 *           type: boolean
 *           example: true
 *
 * /mailing/accounts:
 *   post:
 *     summary: Registrar nueva cuenta SMTP
 *     tags:
 *       - Mailing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailAccountInput'
 *           example:
 *             email: conecta01@upchiapas.edu.mx
 *             password: mi_contraseña_super_segura
 *             host: smtp.gmail.com
 *             port: 587
 *             daily_limit: 500
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EmailAccountResponse'
 *       400:
 *         description: Bad Request
 *
 *   get:
 *     summary: Listar cuentas SMTP
 *     tags:
 *       - Mailing
 *     responses:
 *       200:
 *         description: Listado de cuentas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmailAccountResponse'
 *
 * /mailing/accounts/{id}:
 *   patch:
 *     summary: Editar cuenta SMTP (parcial o rotación de contraseña)
 *     tags:
 *       - Mailing
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: nueva_contraseña_2026
 *               host:
 *                 type: string
 *                 example: smtp.office365.com
 *               daily_limit:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Configuración actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/EmailAccountResponse'
 *                 message:
 *                   type: string
 *                   example: Configuración actualizada correctamente
 *       400:
 *         description: Bad Request
 *
 *   delete:
 *     summary: Baja lógica de cuenta SMTP
 *     tags:
 *       - Mailing
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Cuenta desactivada correctamente
 *       400:
 *         description: Bad Request
 */
