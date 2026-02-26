import { Router } from 'express';
import { requireAuth, requireRoles } from '../../../../core/middleware/authorization';
import { CreateUsuarioInternoController } from '../controller/CreateUsuarioInternoController';
import { GetUsuariosInternosController } from '../controller/GetUsuariosInternosController';
import { GetUsuarioInternoByIdController } from '../controller/GetUsuarioInternoByIdController';
import { UpdateUsuarioInternoController } from '../controller/UpdateUsuarioInternoController';
import { ResetPasswordController } from '../controller/ResetPasswordController';
import { DeactivateUsuarioInternoController } from '../controller/DeactivateUsuarioInternoController';
import { ProgramAssignmentController } from '../controller/ProgramAssignmentController';
import { GetRolesUsuariosInternosController } from '../controller/GetRolesUsuariosInternosController';
import {
  createUsuarioInternoUsecase,
  getRolesUsuariosInternosUsecase,
  getUsuariosInternosUsecase,
  getUsuarioInternoByIdUsecase,
  updateUsuarioInternoUsecase,
  resetPasswordUsuarioInternoUsecase,
  deactivateUsuarioInternoUsecase,
  assignProgramsToDirectorUsecase,
  getUserProgramsUsecase,
  removeUserProgramUsecase,
} from '../../dependencies';

export function createUsuariosInternosRoutes(): Router {
  const router = Router();

  const createController = new CreateUsuarioInternoController(createUsuarioInternoUsecase);
  const getRolesController = new GetRolesUsuariosInternosController(
    getRolesUsuariosInternosUsecase
  );
  const getController = new GetUsuariosInternosController(getUsuariosInternosUsecase);
  const getByIdController = new GetUsuarioInternoByIdController(getUsuarioInternoByIdUsecase);
  const updateController = new UpdateUsuarioInternoController(updateUsuarioInternoUsecase);
  const resetController = new ResetPasswordController(resetPasswordUsuarioInternoUsecase);
  const deactivateController = new DeactivateUsuarioInternoController(
    deactivateUsuarioInternoUsecase
  );
  const programController = new ProgramAssignmentController(
    assignProgramsToDirectorUsecase,
    getUserProgramsUsecase,
    removeUserProgramUsecase
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos:
   *   post:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Crear nuevo usuario interno
   *     security:
   *       - sessionAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateInternalUserRequest'
   *     responses:
   *       201:
   *         description: Usuario interno creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/InternalUserResponse'
   *       400:
   *         description: Error de validación
   */
  router.post(
    '/',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => createController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos:
   *   get:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Listar usuarios internos
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: query
   *         name: id_rol
   *         schema:
   *           type: number
   *         description: Filtrar por ID de rol
   *       - in: query
   *         name: is_active
   *         schema:
   *           type: boolean
   *         description: Filtrar por estado (true/false)
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Buscar en nombre o email
   *     responses:
   *       200:
   *         description: Lista de usuarios internos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/InternalUserResponse'
   */
  router.get(
    '/',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => getController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/roles:
   *   get:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Obtener catálogo de roles de usuarios internos
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Lista de roles
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id_rol:
   *                         type: number
   *                         example: 1
   *                       nombre:
   *                         type: string
   *                         example: super_admin
   */
  router.get(
    '/roles',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => getRolesController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}:
   *   get:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Obtener usuario interno por ID
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Usuario interno encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/InternalUserResponse'
   *       404:
   *         description: Usuario no encontrado
   */
  router.get(
    '/:id',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => getByIdController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}:
   *   patch:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Actualizar usuario interno
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateInternalUserRequest'
   *     responses:
   *       200:
   *         description: Usuario actualizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/InternalUserResponse'
   */
  router.patch(
    '/:id',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => updateController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}/reset-password:
   *   patch:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Restablecer contraseña
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordRequest'
   *     responses:
   *       200:
   *         description: Contraseña restablecida
   */
  router.patch(
    '/:id/reset-password',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => resetController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}/deactivate:
   *   patch:
   *     tags:
   *       - Admin - Usuarios Internos
   *     summary: Desactivar usuario
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Usuario desactivado
   */
  router.patch(
    '/:id/deactivate',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => deactivateController.handle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}/programas:
   *   post:
   *     tags:
   *       - Admin - Usuarios Internos - Programas
   *     summary: Asignar programas a director
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AssignProgramsRequest'
   *     responses:
   *       200:
   *         description: Programas asignados
   */
  router.post(
    '/:id/programas',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => programController.assignProgramsHandle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}/programas:
   *   get:
   *     tags:
   *       - Admin - Usuarios Internos - Programas
   *     summary: Obtener programas asignados
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Programas del usuario
   */
  router.get(
    '/:id/programas',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => programController.getProgramsHandle(req, res)
  );

  /**
   * @openapi
   * /api/admin/usuarios-internos/{id}/programas/{idPrograma}:
   *   delete:
   *     tags:
   *       - Admin - Usuarios Internos - Programas
   *     summary: Remover asignación de programa
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: number
   *       - in: path
   *         name: idPrograma
   *         required: true
   *         schema:
   *           type: number
   *     responses:
   *       200:
   *         description: Programa removido
   */
  router.delete(
    '/:id/programas/:idPrograma',
    requireAuth,
    requireRoles(['super_admin']),
    (req, res) => programController.removeProgramHandle(req, res)
  );

  return router;
}
