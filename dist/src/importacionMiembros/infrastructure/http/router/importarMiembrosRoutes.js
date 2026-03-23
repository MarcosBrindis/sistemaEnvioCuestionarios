"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const importarMiembrosController_1 = require("../controller/importarMiembrosController");
const buscarEgresadosController_1 = require("../controller/buscarEgresadosController");
const dependencies_1 = require("../../dependencies");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/grupos/{id}/miembros/importar:
 *   post:
 *     tags:
 *       - Grupos
 *     summary: Importar miembros masivamente a un grupo usando filtros
 *     description: |
 *       Agrega egresados a un grupo usando filtros avanzados, sin enviar IDs individuales.
 *       Filtros disponibles:
 *       - id_programa_educativo: ID del programa educativo (carrera)
 *       - id_periodo_egreso: ID del periodo de egreso
 *       - cohorte: Código de cohorte del periodo de egreso (ej. 241 = ENE-ABR 2024)
 *       - prefijo_matricula: Primeros 3 dígitos de la matrícula (año/periodo de ingreso, ej. "113")
 *       - busqueda: Texto libre (nombre, matrícula, correo)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: importacion-masiva
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       filtros:
 *                         type: object
 *                         properties:
 *                           id_programa_educativo:
 *                             type: integer
 *                             example: 5
 *                           id_periodo_egreso:
 *                             type: integer
 *                             example: 20
 *                           cohorte:
 *                             type: integer
 *                             example: 241
 *                             description: Código de cohorte (ej. 241 = ENE-ABR 2024)
 *                           prefijo_matricula:
 *                             type: string
 *                             example: "113"
 *                             description: Primeros 3 dígitos de la matrícula (año/periodo de ingreso)
 *                           busqueda:
 *                             type: string
 *                             example: "Juan"
 *     responses:
 *       200:
 *         description: Importación completada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: importacion-masiva
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         mensaje:
 *                           type: string
 *                           example: Importación completada
 *                         usuarios_encontrados:
 *                           type: integer
 *                           example: 150
 *                         nuevos_agregados:
 *                           type: integer
 *                           example: 148
 *                         ya_estaban_en_grupo:
 *                           type: integer
 *                           example: 2
 */
router.post('/grupos/:id/miembros/importar', (0, importarMiembrosController_1.importarMiembrosController)(dependencies_1.dependencies.importarMiembrosPorFiltro));
/**
 * @openapi
 * /api/egresados:
 *   get:
 *     tags:
 *       - Egresados
 *     summary: Buscar egresados con filtros avanzados y paginación
 *     description: |
 *       Devuelve una lista paginada de egresados según filtros opcionales.
 *       Filtros disponibles:
 *       - id_programa_educativo: ID del programa educativo (carrera)
 *       - id_periodo_egreso: ID del periodo de egreso
 *       - cohorte: Código de cohorte del periodo de egreso (ej. 241 = ENE-ABR 2024)
 *       - prefijo_matricula: Primeros 3 dígitos de la matrícula (año/periodo de ingreso, ej. "113")
 *       - estatus: Estado del egresado (1=pendiente, 2=rechazado, 3=aprobado)
 *       - busqueda: Texto libre (nombre, matrícula, correo)
 *     parameters:
 *       - in: query
 *         name: id_programa_educativo
 *         schema:
 *           type: integer
 *         description: ID del programa educativo
 *       - in: query
 *         name: id_periodo_egreso
 *         schema:
 *           type: integer
 *         description: ID del periodo de egreso
 *       - in: query
 *         name: cohorte
 *         schema:
 *           type: integer
 *         description: Código de cohorte (ej. 241 = ENE-ABR 2024)
 *       - in: query
 *         name: prefijo_matricula
 *         schema:
 *           type: string
 *         description: Primeros 3 dígitos de la matrícula (año/periodo de ingreso)
 *       - in: query
 *         name: estatus
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *         description: Estado del egresado (id_estado o nombre del catálogo)
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Texto libre (nombre, matrícula, correo)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Resultados por página (por defecto 20)
 *     responses:
 *       200:
 *         description: Lista paginada de egresados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Egresado'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 */
router.get('/egresados', (0, buscarEgresadosController_1.buscarEgresadosController)(dependencies_1.dependencies.buscarEgresadosPorFiltro));
exports.default = router;
