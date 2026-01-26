import { Router } from 'express';
import { loginController } from '../controller/loginController';
import { logoutController } from '../controller/logoutController';
import { meController } from '../controller/meController';

const router = Router();

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
 *                 matricula:
 *                   type: string
 *                   example: "123456"
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

router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/me', meController);

export default router;
