import { Router } from 'express';
import { createLaborAchievementController } from '../controller/createLaborAchievementController';
import { getLaborAchievementsController } from '../controller/getLaborAchievementsController';
import { getAllLaborAchievementsController } from '../controller/getAllLaborAchievementsController';
import { getLaborAchievementByIdController } from '../controller/getLaborAchievementByIdController';
import { updateLaborAchievementController } from '../controller/updateLaborAchievementController';
import { deleteLaborAchievementController } from '../controller/deleteLaborAchievementController';

const router = Router({ mergeParams: true });


/**
 * @openapi
 * /api/egresado/logros-laborales/all:
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Obtener todos los logros laborales de todos los egresados
 *     responses:
 *       200:
 *         description: Lista de todos los logros laborales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: logros-laborales
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       attributes:
 *                         type: object
 *                         properties:
 *                           empresa:
 *                             type: string
 *                             example: "Empresa S.A."
 *                           puesto:
 *                             type: string
 *                             example: "Desarrollador"
 *                           fecha:
 *                             type: string
 *                             example: "2025-01-01"
 */
router.get('/all', getAllLaborAchievementsController);


/**
 * @openapi
 * /api/egresado/{id}/logros-laborales:
 *   post:
 *     tags:
 *       - Trayectoria
 *     summary: Crear un logro laboral para un egresado
 *     responses:
 *       201:
 *         description: Logro laboral creado exitosamente
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
 *                       example: logros-laborales
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         empresa:
 *                           type: string
 *                           example: "Empresa S.A."
 *                         puesto:
 *                           type: string
 *                           example: "Desarrollador"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       400:
 *         description: Error de validación o negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
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
 *                     example: logros-laborales
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       empresa:
 *                         type: string
 *                         example: "Empresa S.A."
 *                       puesto:
 *                         type: string
 *                         example: "Desarrollador"
 *                       fecha:
 *                         type: string
 *                         example: "2025-01-01"
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Listar logros laborales de un egresado
 *     responses:
 *       200:
 *         description: Lista de logros laborales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         example: logros-laborales
 *                       id:
 *                         type: string
 *                         example: "1"
 *                       attributes:
 *                         type: object
 *                         properties:
 *                           empresa:
 *                             type: string
 *                             example: "Empresa S.A."
 *                           puesto:
 *                             type: string
 *                             example: "Desarrollador"
 *                           fecha:
 *                             type: string
 *                             example: "2025-01-01"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 */
router.post('/', createLaborAchievementController);
router.get('/', getLaborAchievementsController);

/**
 * @openapi
 * /api/egresado/{id}/logros-laborales/{idLogro}:
 *   get:
 *     tags:
 *       - Trayectoria
 *     summary: Obtener un logro laboral por ID
 *     responses:
 *       200:
 *         description: Logro laboral encontrado
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
 *                       example: logros-laborales
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         empresa:
 *                           type: string
 *                           example: "Empresa S.A."
 *                         puesto:
 *                           type: string
 *                           example: "Desarrollador"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       404:
 *         description: Logro laboral no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro laboral
 *   put:
 *     tags:
 *       - Trayectoria
 *     summary: Actualizar un logro laboral
 *     responses:
 *       200:
 *         description: Logro laboral actualizado correctamente
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
 *                       example: logros-laborales
 *                     id:
 *                       type: string
 *                       example: "1"
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         empresa:
 *                           type: string
 *                           example: "Empresa S.A."
 *                         puesto:
 *                           type: string
 *                           example: "Desarrollador"
 *                         fecha:
 *                           type: string
 *                           example: "2025-01-01"
 *       400:
 *         description: Error de validación o negocio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Logro laboral no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro laboral
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
 *                     example: logros-laborales
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       empresa:
 *                         type: string
 *                         example: "Empresa S.A."
 *                       puesto:
 *                         type: string
 *                         example: "Desarrollador"
 *                       fecha:
 *                         type: string
 *                         example: "2025-01-01"
 *   delete:
 *     tags:
 *       - Trayectoria
 *     summary: Eliminar un logro laboral
 *     responses:
 *       204:
 *         description: Logro laboral eliminado correctamente
 *       404:
 *         description: Logro laboral no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *       - in: path
 *         name: idLogro
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del logro laboral
 */
router.get('/:idLogro', getLaborAchievementByIdController);
router.put('/:idLogro', updateLaborAchievementController);
router.delete('/:idLogro', deleteLaborAchievementController);

export default router;
