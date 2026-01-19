/**
 * @openapi
 * # Módulo de API Clients (Mailing)
 * # Endpoints para gestión de clientes de API Key para el servicio de mailing.
 * # La API Key solo se muestra una vez al crear o rotar, nunca se almacena en texto plano.
 *
 * components:
 *   schemas:
 *     ApiClientInput:
 *       description: Datos para registrar un nuevo cliente de API.
 *       type: object
 *       required: [client_name]
 *       properties:
 *         client_name:
 *           type: string
 *           example: Módulo de Egresados
 *     ApiClientResponse:
 *       description: Respuesta de cliente de API (sin hash).
 *       type: object
 *       properties:
 *         id_client:
 *           type: integer
 *           example: 1
 *         client_name:
 *           type: string
 *           example: Módulo de Egresados
 *         prefix:
 *           type: string
 *           example: sk_live
 *         is_active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: 2026-01-18T12:00:00Z
 *
 * /mailing/clients:
 *   post:
 *     summary: Registrar nuevo cliente de API
 *     tags:
 *       - Mailing - API Clients
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApiClientInput'
 *           example:
 *             client_name: Módulo de Egresados
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_client:
 *                       type: integer
 *                     client_name:
 *                       type: string
 *                     api_key:
 *                       type: string
 *                     message:
 *                       type: string
 *       409:
 *         description: Nombre de cliente duplicado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *   get:
 *     summary: Listar clientes de API
 *     tags:
 *       - Mailing - API Clients
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApiClientResponse'
 *
 * /mailing/clients/{id}/rotate:
 *   patch:
 *     summary: Rotar la API Key de un cliente
 *     tags:
 *       - Mailing - API Clients
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: API Key rotada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_client:
 *                       type: integer
 *                     client_name:
 *                       type: string
 *                     new_api_key:
 *                       type: string
 *                     message:
 *                       type: string
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *
 * /mailing/clients/{id}/revoke:
 *   patch:
 *     summary: Revocar un cliente de API
 *     tags:
 *       - Mailing - API Clients
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Cliente revocado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
	*
	* /mailing/clients/{id}/activate:
	*   patch:
	*     summary: Reactivar un cliente de API lógicamente eliminado
	*     tags:
	*       - Mailing - API Clients
	*     parameters:
	*       - name: id
	*         in: path
	*         required: true
	*         schema:
	*           type: integer
	*         example: 1
	*     responses:
	*       200:
	*         description: Cliente reactivado
	*         content:
	*           application/json:
	*             schema:
	*               type: object
	*               properties:
	*                 data:
	*                   $ref: '#/components/schemas/ApiClientResponse'
	*       400:
	*         description: El cliente ya está activo
	*         content:
	*           application/json:
	*             schema:
	*               type: object
	*               properties:
	*                 error:
	*                   type: string
	*       404:
	*         description: Cliente no encontrado
	*         content:
	*           application/json:
	*             schema:
	*               type: object
	*               properties:
	*                 error:
	*                   type: string
 */
