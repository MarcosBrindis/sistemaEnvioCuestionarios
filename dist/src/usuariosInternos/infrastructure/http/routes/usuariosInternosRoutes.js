"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsuariosInternosRoutes = createUsuariosInternosRoutes;
const express_1 = require("express");
const authorization_1 = require("../../../../core/middleware/authorization");
const CreateUsuarioInternoController_1 = require("../controller/CreateUsuarioInternoController");
const GetUsuariosInternosController_1 = require("../controller/GetUsuariosInternosController");
const GetUsuarioInternoByIdController_1 = require("../controller/GetUsuarioInternoByIdController");
const UpdateUsuarioInternoController_1 = require("../controller/UpdateUsuarioInternoController");
const ResetPasswordController_1 = require("../controller/ResetPasswordController");
const DeactivateUsuarioInternoController_1 = require("../controller/DeactivateUsuarioInternoController");
const ProgramAssignmentController_1 = require("../controller/ProgramAssignmentController");
const GetRolesUsuariosInternosController_1 = require("../controller/GetRolesUsuariosInternosController");
const dependencies_1 = require("../../dependencies");
function createUsuariosInternosRoutes() {
    const router = (0, express_1.Router)();
    const createController = new CreateUsuarioInternoController_1.CreateUsuarioInternoController(dependencies_1.createUsuarioInternoUsecase);
    const getRolesController = new GetRolesUsuariosInternosController_1.GetRolesUsuariosInternosController(dependencies_1.getRolesUsuariosInternosUsecase);
    const getController = new GetUsuariosInternosController_1.GetUsuariosInternosController(dependencies_1.getUsuariosInternosUsecase);
    const getByIdController = new GetUsuarioInternoByIdController_1.GetUsuarioInternoByIdController(dependencies_1.getUsuarioInternoByIdUsecase);
    const updateController = new UpdateUsuarioInternoController_1.UpdateUsuarioInternoController(dependencies_1.updateUsuarioInternoUsecase);
    const resetController = new ResetPasswordController_1.ResetPasswordController(dependencies_1.resetPasswordUsuarioInternoUsecase);
    const deactivateController = new DeactivateUsuarioInternoController_1.DeactivateUsuarioInternoController(dependencies_1.deactivateUsuarioInternoUsecase);
    const programController = new ProgramAssignmentController_1.ProgramAssignmentController(dependencies_1.assignProgramsToDirectorUsecase, dependencies_1.getUserProgramsUsecase, dependencies_1.removeUserProgramUsecase);
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
    router.post('/', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => createController.handle(req, res));
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
    router.get('/', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => getController.handle(req, res));
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
    router.get('/roles', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => getRolesController.handle(req, res));
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
    router.get('/:id', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => getByIdController.handle(req, res));
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
    router.patch('/:id', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => updateController.handle(req, res));
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
    router.patch('/:id/reset-password', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => resetController.handle(req, res));
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
    router.patch('/:id/deactivate', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => deactivateController.handle(req, res));
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
    router.post('/:id/programas', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => programController.assignProgramsHandle(req, res));
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
    router.get('/:id/programas', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => programController.getProgramsHandle(req, res));
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
    router.delete('/:id/programas/:idPrograma', authorization_1.requireAuth, (0, authorization_1.requireRoles)(['super_admin']), (req, res) => programController.removeProgramHandle(req, res));
    return router;
}
