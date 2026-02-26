import { Router } from 'express';
import { dependencies } from '../../dependencies';
import { syncEgresadosController } from '../controller/syncEgresadosController';
import { actualizarPeriodosController } from '../controller/actualizarPeriodosController';
import laborAchievementRoutes from '../../../../laborAchievement/infrastructure/http/router/laborAchievementRoutes';
import academicAchievementRoutes from '../../../../academicAchievement/infrastructure/http/router/academicAchievementRoutes';
import { updatePerfilController } from '../controller/updatePerfilController';
import { updatePerfilCompletoController } from '../controller/updatePerfilCompletoController';
import { updatePerfilCompletoAdminController } from '../controller/updatePerfilCompletoAdminController';
import { updateEstadoEgresadoController } from '../controller/updateEstadoEgresadoController';
import { updateEgresadoSinopsisController } from '../controller/updateEgresadoSinopsisController';
import { getEgresadoSinopsisController } from '../controller/getEgresadoSinopsisController';
import { requestLogger } from '../../../../core/middleware/requestLogger';
import { getProgramasEducativosController } from '../controller/getProgramasEducativosController';
import { getEgresadoWithAchievementsController } from '../controller/getEgresadoWithAchievementsController';
import { getAllEgresadosWithAchievementsController } from '../controller/getAllEgresadosWithAchievementsController';
import { multerConfig } from '../../../../config/multer';
import { authEgresado } from '../../../../core/middleware/authEgresado';
import {
	requireAuth,
	requireProgramScopeOnEgresadoParam,
	requireRoles,
	requireSelfOrRoles,
} from '../../../../core/middleware/authorization';

const router = Router();
router.use(requestLogger);

/**
 * @openapi
 * /api/egresado/{id}/perfil:
 *   patch:
 *     tags:
 *       - Egresados
 *     summary: Actualizar datos de contacto y foto de perfil del egresado
 *     description: |
 *       Permite que el egresado actualice su email, fecha de nacimiento e imagen de perfil (URL).
 *       Solo el propio egresado puede editar su perfil (validación por sesión).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado a actualizar (debe coincidir con el de la sesión)
 *     requestBody:
 *       required: true
 *       content:
 *         'multipart/form-data':
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON API en texto (opcional si envías campos directos)
 *                 example: '{"type":"egresados","id":"50","attributes":{"email":"mi_nuevo_correo@gmail.com","fecha_nacimiento":"1999-05-20"}}'
 *               email:
 *                 type: string
 *                 example: mi_nuevo_correo@gmail.com
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1999-05-20"
 *               imagen_egresado:
 *                 type: string
 *                 format: uri
 *                 example: https://miservidor.com/uploads/foto_perfil_50.jpg
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil a subir
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: egresados
 *                   id:
 *                     type: string
 *                     example: "50"
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: mi_nuevo_correo@gmail.com
 *                       fecha_nacimiento:
 *                         type: string
 *                         format: date
 *                         example: "1999-05-20"
 *                       imagen_egresado:
 *                         type: string
 *                         example: https://miservidor.com/uploads/foto_perfil_50.jpg
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
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
 *                       example: egresados
 *                     id:
 *                       type: integer
 *                       example: 50
 *                     attributes:
 *                       $ref: '#/components/schemas/Egresado'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado para editar este perfil
 */
router.patch(
	'/:id/perfil',
	authEgresado,
	multerConfig.single('file'),
	updatePerfilController(dependencies.updateEgresadoPerfil, dependencies.uploadFile)
);

/**
 * @openapi
 * /api/egresado/{id}/perfil-completo:
 *   patch:
 *     tags:
 *       - Egresados
 *     summary: Actualizar perfil completo del egresado
 *     description: |
 *       Permite que el egresado actualice su perfil completo incluyendo:
 *       - Nombre
 *       - Primer apellido
 *       - Segundo apellido (opcional)
 *       - Email
 *       - Fecha de nacimiento
 *       - Imagen de perfil (URL)
 *       - Programa educativo
 *       - Período
 *       - Estado del perfil
 *       
 *       NO se permite editar: matricula, curp (campos de identidad)
 *       Solo el propio egresado puede editar su perfil (validación por sesión).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado a actualizar (debe coincidir con el de la sesión)
 *     requestBody:
 *       required: true
 *       content:
 *         'multipart/form-data':
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON API en texto (opcional si envías campos directos)
 *                 example: '{"type":"egresados","id":"50","attributes":{"nombre":"Juan Carlos","primer_apellido":"Pérez","email":"mi_nuevo_correo@gmail.com"}}'
 *               nombre:
 *                 type: string
 *                 example: "Juan Carlos"
 *               primer_apellido:
 *                 type: string
 *                 example: "Pérez"
 *               segundo_apellido:
 *                 type: string
 *                 example: "García"
 *               email:
 *                 type: string
 *                 example: mi_nuevo_correo@gmail.com
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1999-05-20"
 *               imagen_egresado:
 *                 type: string
 *                 format: uri
 *                 example: https://miservidor.com/uploads/foto_perfil_50.jpg
 *               id_programa_educativo:
 *                 type: integer
 *                 example: 1
 *               id_periodo:
 *                 type: integer
 *                 example: 5
 *               id_estado:
 *                 type: integer
 *                 example: 3
 *                 description: "1=pendiente, 2=rechazado, 3=aprobado"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil a subir
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: egresados
 *                   id:
 *                     type: string
 *                     example: "50"
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Juan Carlos"
 *                       primer_apellido:
 *                         type: string
 *                         example: "Pérez"
 *                       segundo_apellido:
 *                         type: string
 *                         nullable: true
 *                         example: "García"
 *                       email:
 *                         type: string
 *                         example: mi_nuevo_correo@gmail.com
 *                       fecha_nacimiento:
 *                         type: string
 *                         format: date
 *                         example: "1999-05-20"
 *                       imagen_egresado:
 *                         type: string
 *                         example: https://miservidor.com/uploads/foto_perfil_50.jpg
 *                       id_programa_educativo:
 *                         type: integer
 *                         example: 1
 *                       id_periodo:
 *                         type: integer
 *                         example: 5
 *                       id_estado:
 *                         type: integer
 *                         example: 3
 *                         description: "1=pendiente, 2=rechazado, 3=aprobado"
 *     responses:
 *       200:
 *         description: Perfil actualizado correctamente
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
 *                       example: egresados
 *                     id:
 *                       type: integer
 *                       example: 50
 *                     attributes:
 *                       $ref: '#/components/schemas/Egresado'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado para editar este perfil
 */
router.patch(
	'/:id/perfil-completo',
	authEgresado,
	multerConfig.single('file'),
	updatePerfilCompletoController(dependencies.updatePerfilCompleto, dependencies.uploadFile)
);

/**
 * @openapi
 * /api/egresado/admin/{id}/perfil-completo:
 *   patch:
 *     tags:
 *       - Egresados - Admin
 *       - Admin
 *     summary: Actualizar perfil completo de un egresado (Admin)
 *     description: |
 *       Permite que un administrador actualice el perfil completo de cualquier egresado.
 *       Incluye la capacidad de aprobar/rechazar perfiles mediante el cambio de estado.
 *       Campos editables: nombre, apellidos, email, fecha de nacimiento, imagen, programa educativo, período y estado.
 *       Campos NO editables: matrícula y CURP (campos de identidad).
 *       
 *       **Nota:** Por ahora no valida permisos de administrador. Esta validación se agregará cuando se implemente la capa de autenticación de administradores.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         'multipart/form-data':
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON API en texto (opcional si envías campos directos)
 *                 example: '{"type":"egresados","id":"50","attributes":{"nombre":"Juan","primer_apellido":"Pérez","email":"juan.perez@example.com"}}'
 *               nombre:
 *                 type: string
 *                 example: "Juan"
 *               primer_apellido:
 *                 type: string
 *                 example: "Pérez"
 *               segundo_apellido:
 *                 type: string
 *                 example: "García"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-20"
 *               imagen_egresado:
 *                 type: string
 *                 format: uri
 *                 example: "https://servidor.com/foto.jpg"
 *               id_programa_educativo:
 *                 type: integer
 *                 example: 1
 *               id_periodo:
 *                 type: integer
 *                 example: 5
 *               id_estado:
 *                 type: integer
 *                 description: "1=Aprobado, 2=Pendiente, 3=Rechazado"
 *                 enum: [1, 2, 3]
 *                 example: 1
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil a subir
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: egresados
 *                   id:
 *                     type: string
 *                     example: "50"
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       nombre:
 *                         type: string
 *                         example: "Juan"
 *                       primer_apellido:
 *                         type: string
 *                         example: "Pérez"
 *                       segundo_apellido:
 *                         type: string
 *                         nullable: true
 *                         example: "García"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "juan.perez@example.com"
 *                       fecha_nacimiento:
 *                         type: string
 *                         format: date
 *                         example: "1995-05-20"
 *                       imagen_egresado:
 *                         type: string
 *                         format: uri
 *                         example: "https://servidor.com/foto.jpg"
 *                       id_programa_educativo:
 *                         type: integer
 *                         example: 1
 *                       id_periodo:
 *                         type: integer
 *                         example: 5
 *                       id_estado:
 *                         type: integer
 *                         description: "1=Aprobado, 2=Pendiente, 3=Rechazado"
 *                         enum: [1, 2, 3]
 *                         example: 1
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
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
 *                       example: egresados
 *                     id:
 *                       type: integer
 *                       example: 50
 *                     attributes:
 *                       $ref: '#/components/schemas/Egresado'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Egresado no encontrado
 */
router.patch(
	'/admin/:id/perfil-completo',
	requireAuth,
	requireRoles(['super_admin', 'director_vinculacion']),
	multerConfig.single('file'),
	updatePerfilCompletoAdminController(dependencies.updatePerfilCompletoAdmin, dependencies.uploadFile)
);

/**
 * @openapi
 * /api/egresado/{id}/estado:
 *   patch:
 *     tags:
 *       - Egresados
 *       - Admin
 *     summary: Actualizar estado del egresado
 *     description: |
 *       Actualiza el estado de un egresado. 
 *       Estados disponibles:
 *       - 1: Pendiente (default cuando se crea)
 *       - 2: Rechazado
 *       - 3: Aprobado
 *       
 *       Esta operación generalmente la realiza un administrador del sistema.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado a actualizar
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
 *                     example: egresados
 *                   id:
 *                     type: string
 *                     example: "50"
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       id_estado:
 *                         type: integer
 *                         example: 3
 *                         description: "1=pendiente, 2=rechazado, 3=aprobado"
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
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
 *                       example: egresados
 *                     id:
 *                       type: integer
 *                       example: 50
 *                     attributes:
 *                       $ref: '#/components/schemas/Egresado'
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Egresado no encontrado
 */
router.patch(
	'/:id/estado',
	requireAuth,
	requireRoles(['super_admin', 'director_vinculacion', 'director_programa_educativo']),
	requireProgramScopeOnEgresadoParam('id'),
	updateEstadoEgresadoController(dependencies.updateEstadoEgresado)
);

/**
 * @openapi
 * /api/egresado/{id}/sinopsis:
 *   get:
 *     tags:
 *       - Egresados
 *     summary: Obtener sinopsis profesional del egresado
 *     description: |
 *       Obtiene solo la sinopsis (resumen profesional) general del egresado de forma optimizada.
 *       Ideal para mostrar en interfaces de logros sin cargar todos los datos del perfil.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *     responses:
 *       200:
 *         description: Sinopsis obtenida exitosamente
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
 *                       example: egresados-sinopsis
 *                     id:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         sinopsis:
 *                           type: string
 *                           nullable: true
 *                           example: "Profesional con maestría en Ciencia de Datos..."
 *       404:
 *         description: Egresado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/sinopsis', getEgresadoSinopsisController);

/**
 * @openapi
 * /api/egresado/{id}/sinopsis:
 *   patch:
 *     tags:
 *       - Egresados
 *     summary: Actualizar sinopsis profesional del egresado
 *     description: |
 *       Permite actualizar la sinopsis (resumen profesional) general del egresado.
 *       Este campo es de uso general para mostrar en la interfaz del perfil e interfaces de logros.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado a actualizar
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
 *                     example: egresados
 *                   attributes:
 *                     type: object
 *                     properties:
 *                       sinopsis:
 *                         type: string
 *                         nullable: true
 *                         example: "Profesional con maestría en Ciencia de Datos y experiencia en desarrollo de software..."
 *     responses:
 *       200:
 *         description: Sinopsis actualizada exitosamente
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
 *                       example: egresados
 *                     id:
 *                       type: string
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         sinopsis:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Datos inválidos en la solicitud
 *       404:
 *         description: Egresado no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/:id/sinopsis', updateEgresadoSinopsisController);

/**
 * @openapi
 * /api/egresado/programas-educativos:
 *   get:
 *     tags:
 *       - Egresados
 *     summary: Listar programas educativos
 *     description: Devuelve el catálogo de programas educativos para poblar selects en el frontend.
 *     responses:
 *       200:
 *         description: Lista de programas educativos
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
 *                       id_programa_educativo:
 *                         type: integer
 *                         example: 30001
 *                       nombre:
 *                         type: string
 *                         example: Ingeniería en Software
 */
router.get('/programas-educativos', getProgramasEducativosController(dependencies.getProgramasEducativos));

/**
 * @openapi
 * /api/egresado/sync:
 *   post:
 *     tags:
 *       - Egresados
 *       - Admin
 *     summary: Sincronizar egresados desde el servicio externo Platinum
 *     description: |
 *       Obtiene egresados del servicio externo Platinum y los sincroniza con la base de datos local.
 *       Solo inserta nuevos egresados, no actualiza los existentes.
 *       
 *       Parámetros opcionales de filtro (query parameters):
 *       - programa: Filtrar por programa educativo
 *       - matricula_like: Filtrar por matrícula (cohorte)
 *       - periodo: Filtrar por periodo específico
 *       - periodo_from: Filtrar desde periodo
 *       - periodo_to: Filtrar hasta periodo
 *     parameters:
 *       - in: query
 *         name: programa
 *         schema:
 *           type: string
 *         description: ID del programa educativo para filtrar
 *       - in: query
 *         name: matricula_like
 *         schema:
 *           type: string
 *         description: Matrícula (cohorte) para filtrar
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Periodo específico para filtrar
 *       - in: query
 *         name: periodo_from
 *         schema:
 *           type: string
 *         description: Periodo desde para filtrar
 *       - in: query
 *         name: periodo_to
 *         schema:
 *           type: string
 *         description: Periodo hasta para filtrar
 *     responses:
 *       200:
 *         description: Sincronización completada con resumen
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
 *                       example: integracion
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           enum: [completado, parcial, fallido]
 *                         resumen:
 *                           type: object
 *                           properties:
 *                             periodos_nuevos:
 *                               type: integer
 *                               example: 1
 *                             egresados_procesados_total:
 *                               type: integer
 *                               example: 150
 *                             nuevos_insertados:
 *                               type: integer
 *                               example: 25
 *                             existentes_ignorados:
 *                               type: integer
 *                               example: 125
 *                 meta:
 *                   type: object
 *                   properties:
 *                     programas_nuevos:
 *                       type: integer
 *                       example: 2
 *                     errores:
 *                       type: integer
 *                       example: 0
 *       502:
 *         description: Error al conectar con el servicio externo
 */
const syncEgresados = syncEgresadosController(dependencies.syncEgresadosFromPlatinum);

router.post('/sync', requireAuth, requireRoles(['super_admin', 'director_vinculacion']), syncEgresados);

/**
 * @openapi
 * /api/egresado/actualizar-periodos:
 *   post:
 *     tags:
 *       - Egresados
 *       - Admin
 *     summary: Actualizar el periodo de egreso de los egresados existentes
 *     description: |
 *       Obtiene los egresados del servicio externo Platinum y actualiza el campo id_periodo
 *       de los egresados existentes en la base de datos local.
 *       
 *       Este endpoint es útil para corregir egresados que fueron sincronizados sin su periodo
 *       de egreso correctamente asignado.
 *       
 *       Parámetros opcionales de filtro (query parameters):
 *       - programa: Filtrar por programa educativo
 *       - matricula_like: Filtrar por matrícula (cohorte de ingreso)
 *       - periodo: Filtrar por periodo específico
 *       - periodo_from: Filtrar desde periodo
 *       - periodo_to: Filtrar hasta periodo
 *     parameters:
 *       - in: query
 *         name: programa
 *         schema:
 *           type: string
 *         description: ID del programa educativo para filtrar
 *       - in: query
 *         name: matricula_like
 *         schema:
 *           type: string
 *         description: Matrícula (cohorte de ingreso) para filtrar
 *       - in: query
 *         name: periodo
 *         schema:
 *           type: string
 *         description: Periodo específico para filtrar
 *       - in: query
 *         name: periodo_from
 *         schema:
 *           type: string
 *         description: Periodo desde para filtrar
 *       - in: query
 *         name: periodo_to
 *         schema:
 *           type: string
 *         description: Periodo hasta para filtrar
 *     responses:
 *       200:
 *         description: Actualización completada con resumen
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
 *                       example: actualizacion-periodos
 *                     attributes:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           enum: [completado, parcial, fallido]
 *                         resumen:
 *                           type: object
 *                           properties:
 *                             egresados_procesados:
 *                               type: integer
 *                               example: 1500
 *                             actualizados:
 *                               type: integer
 *                               example: 1200
 *                             sin_periodo_externo:
 *                               type: integer
 *                               example: 50
 *                             periodo_no_encontrado:
 *                               type: integer
 *                               example: 100
 *                             errores:
 *                               type: integer
 *                               example: 0
 *       502:
 *         description: Error al conectar con el servicio externo
 */
const actualizarPeriodos = actualizarPeriodosController(dependencies.actualizarPeriodosEgresados);

router.post('/actualizar-periodos', requireAuth, requireRoles(['super_admin', 'director_vinculacion']), actualizarPeriodos);

/**
 * @openapi
 * /api/egresado/{id}/perfil-completo:
 *   get:
 *     tags:
 *       - Egresados
 *     summary: Obtener perfil completo del egresado
 *     description: |
 *       Devuelve la información del egresado en formato legible.
 *       Incluye el nombre del programa educativo además de su identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del egresado
 *     responses:
 *       200:
 *         description: Perfil completo del egresado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     egresado:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         nombre:
 *                           type: string
 *                           example: Juan
 *                         primer_apellido:
 *                           type: string
 *                           example: Pérez
 *                         segundo_apellido:
 *                           type: string
 *                           nullable: true
 *                           example: García
 *                         matricula:
 *                           type: string
 *                           example: 2020010001
 *                         curp:
 *                           type: string
 *                           example: PEGJ000101HDFRRN09
 *                         email:
 *                           type: string
 *                           nullable: true
 *                           example: juan.perez@email.com
 *                         imagen_egresado:
 *                           type: string
 *                           nullable: true
 *                           example: https://example.com/foto.jpg
 *                         fecha_nacimiento:
 *                           type: string
 *                           nullable: true
 *                           example: 2000-01-01
 *                         is_active:
 *                           type: boolean
 *                           example: true
 *                         id_estado:
 *                           type: integer
 *                           example: 3
 *                         id_programa_educativo:
 *                           type: integer
 *                           nullable: true
 *                           example: 5
 *                         programa_educativo:
 *                           type: string
 *                           nullable: true
 *                           example: Ingeniería Software
 *                         id_periodo:
 *                           type: integer
 *                           nullable: true
 *                           example: 12
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: El ID del egresado debe ser un número válido
 *       404:
 *         description: Egresado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Egresado no encontrado
 */
const getEgresadoWithAchievements = getEgresadoWithAchievementsController(dependencies.getEgresadoWithAchievements);

router.get(
	'/:id/perfil-completo',
	requireAuth,
	requireSelfOrRoles('id', ['super_admin', 'director_vinculacion', 'director_programa_educativo']),
	requireProgramScopeOnEgresadoParam('id'),
	getEgresadoWithAchievements
);

/**
 * @openapi
 * /api/egresado/perfiles-completos:
 *   get:
 *     tags:
 *       - Egresados
 *     summary: Obtener todos los perfiles completos de egresados
 *     description: |
 *       Devuelve la información de todos los egresados en formato legible.
 *       Incluye el nombre del programa educativo además de su identificador.
 *     responses:
 *       200:
 *         description: Perfiles completos de egresados obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       egresado:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             example: Juan
 *                           primer_apellido:
 *                             type: string
 *                             example: Pérez
 *                           segundo_apellido:
 *                             type: string
 *                             nullable: true
 *                             example: García
 *                           matricula:
 *                             type: string
 *                             example: 2020010001
 *                           curp:
 *                             type: string
 *                             example: PEGJ000101HDFRRN09
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: juan.perez@email.com
 *                           imagen_egresado:
 *                             type: string
 *                             nullable: true
 *                             example: https://example.com/foto.jpg
 *                           fecha_nacimiento:
 *                             type: string
 *                             nullable: true
 *                             example: 2000-01-01
 *                           is_active:
 *                             type: boolean
 *                             example: true
 *                           id_estado:
 *                             type: integer
 *                             example: 3
 *                           id_programa_educativo:
 *                             type: integer
 *                             nullable: true
 *                             example: 5
 *                           programa_educativo:
 *                             type: string
 *                             nullable: true
 *                             example: Ingeniería en Software
 *                           id_periodo:
 *                             type: integer
 *                             nullable: true
 *                             example: 12
 *                 total:
 *                   type: integer
 *                   description: Cantidad total de egresados retornados
 *                   example: 150
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al obtener los perfiles de egresados
 */
const getAllEgresadosWithAchievements = getAllEgresadosWithAchievementsController(dependencies.getAllEgresadosWithAchievements);

router.get(
	'/perfiles-completos',
	requireAuth,
	requireRoles(['super_admin', 'director_vinculacion', 'director_programa_educativo']),
	getAllEgresadosWithAchievements
);

// Rutas para gestión de trayectoria (logros)
router.use('/:id/logros-laborales', laborAchievementRoutes);
router.use('/:id/logros-academicos', academicAchievementRoutes);

export default router;