"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controller/loginController");
const staffLoginController_1 = require("../controller/staffLoginController");
const logoutController_1 = require("../controller/logoutController");
const meController_1 = require("../controller/meController");
const router = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLoginRequest:
 *       type: object
 *       required: [data]
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "auth"
 *             attributes:
 *               type: object
 *               properties:
 *                 curp:
 *                   type: string
 *                   example: "ABCD123456HDF..."
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "egresados"
 *             id:
 *               type: string
 *               example: "50"
 *             attributes:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 email:
 *                   type: string
 *                   example: "juan@gmail.com"
 *                 mensaje:
 *                   type: string
 *                   example: "Sesión iniciada correctamente"
 *     AuthStaffLoginRequest:
 *       type: object
 *       required: [data]
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "auth-staff"
 *             attributes:
 *               type: object
 *               required: [email, password]
 *               properties:
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: "233317@ids.upchiapas.edu.mx"
 *                 password:
 *                   type: string
 *                   example: "125645"
 *     AuthStaffLoginResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "usuarios-internos"
 *             id:
 *               type: string
 *               example: "1"
 *             attributes:
 *               type: object
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: "super admin"
 *                 email:
 *                   type: string
 *                   example: "233317@ids.upchiapas.edu.mx"
 *                 rol:
 *                   type: string
 *                   enum: [super_admin, director_vinculacion, director_programa_educativo]
 *                   example: "super_admin"
 *                 mensaje:
 *                   type: string
 *                   example: "Sesión iniciada correctamente"
 *     AuthMeResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: "sesion"
 *             attributes:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "50"
 *                     nombre:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     rol:
 *                       type: string
 *                       example: "egresado"
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de egresado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       401:
 *         description: Credenciales incorrectas
 *       400:
 *         description: Error en la solicitud
 *
 * /api/auth/staff/login:
 *   post:
 *     summary: Iniciar sesión de usuario interno (super-admin/directores)
 *     tags: [Auth, Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthStaffLoginRequest'
 *     responses:
 *       200:
 *         description: Sesión interna iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthStaffLoginResponse'
 *       401:
 *         description: Credenciales incorrectas
 *       400:
 *         description: Error en la solicitud
 *
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión de egresado
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Sesión cerrada correctamente
 *
 * /api/auth/me:
 *   get:
 *     summary: Verificar estado de sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthMeResponse'
 *       401:
 *         description: No autenticado
 */
router.post('/login', loginController_1.loginController);
router.post('/staff/login', staffLoginController_1.staffLoginController);
router.post('/logout', logoutController_1.logoutController);
router.get('/me', meController_1.meController);
exports.default = router;
