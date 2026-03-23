"use strict";
/**
 * @swagger
 * components:
 *   schemas:
 *     GrupoAttributes:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Grupo de egresados 2025"
 *         descripcion:
 *           type: string
 *           example: "Egresados de la generación 2025"
 *     GrupoRequest:
 *       type: object
 *       required: [data]
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "grupos"
 *             attributes:
 *               $ref: '#/components/schemas/GrupoAttributes'
 *     GrupoResource:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "grupos"
 *             id:
 *               type: string
 *               example: "1"
 *             attributes:
 *               $ref: '#/components/schemas/GrupoAttributes'
 *     GrupoListResource:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GrupoResource'
 *     MiembrosGrupoRequest:
 *       type: object
 *       required: [data]
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "miembros-grupo"
 *             attributes:
 *               type: object
 *               properties:
 *                 ids_graduados:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1,2,3]
 *     MiembrosGrupoResource:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "miembros-grupo"
 *               id:
 *                 type: string
 *                 example: "1-2"
 *               attributes:
 *                 type: object
 *                 properties:
 *                   id_grupo:
 *                     type: integer
 *                     example: 1
 *                   id_egresado:
 *                     type: integer
 *                     example: 2
 */
/**
 * @swagger
 * /api/grupo:
 *   post:
 *     summary: Crear un grupo de egresados
 *     tags: [Grupos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrupoRequest'
 *     responses:
 *       201:
 *         description: Grupo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoResource'
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Listar grupos de egresados
 *     tags: [Grupos]
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoListResource'
 *
 * /api/grupo/{id}:
 *   get:
 *     summary: Obtener grupo por ID
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Grupo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoResource'
 *       404:
 *         description: Grupo no encontrado
 *   patch:
 *     summary: Actualizar grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrupoRequest'
 *     responses:
 *       200:
 *         description: Grupo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrupoResource'
 *       400:
 *         description: Error en la solicitud
 *   delete:
 *     summary: Eliminar grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Grupo eliminado correctamente
 *       404:
 *         description: Grupo no encontrado
 *
 * /api/grupo/{id}/members:
 *   post:
 *     summary: Agregar miembros a un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MiembrosGrupoRequest'
 *     responses:
 *       201:
 *         description: Miembros agregados correctamente
 *       400:
 *         description: Error en la solicitud
 *   get:
 *     summary: Listar miembros de un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de miembros
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MiembrosGrupoResource'
 *       404:
 *         description: Grupo no encontrado
 *
 * /api/grupo/{id}/members/{idEgresado}:
 *   delete:
 *     summary: Quitar miembro de un grupo
 *     tags: [Grupos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idEgresado
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Miembro eliminado correctamente
 *       404:
 *         description: Grupo o miembro no encontrado
 */
