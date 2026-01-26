/**
 * @openapi
 * # Módulo de Asignación de Encuestas a Egresados
 * # Instrucciones generales:
 * # - Todos los endpoints requieren autenticación JWT.
 * # - El parámetro {id} es el ID de la encuesta a la que se asignan o consultan participantes.
 * # - El frontend debe enviar los datos siguiendo el formato JSON:API especificado en cada requestBody.
 * # - Para asignar egresados, puedes enviar una lista de IDs o un id_group (asignación masiva por grupo).
 * # - Los endpoints devuelven información minimizada y estandarizada para facilitar la integración.
 *
 * components:
 *   schemas:
 *     SurveyAssignmentInput:
 *       description: |
 *         Objeto para asignar egresados a una encuesta. Debes enviar EITHER una lista de IDs de egresados (lista_egresados) o un id_group para asignar a todos los miembros de un grupo.
 *         Ejemplo de uso para asignación individual o múltiple:
 *         {
 *           "data": {
 *             "type": "asignacion",
 *             "attributes": {
 *               "lista_egresados": [2034, 4055]
 *             }
 *           }
 *         }
 *         Ejemplo de uso para asignación por grupo:
 *         {
 *           "data": {
 *             "type": "asignacion",
 *             "attributes": {
 *               "id_group": 105
 *             }
 *           }
 *         }
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: asignacion
 *             attributes:
 *               type: object
 *               properties:
 *                 lista_egresados:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [2034, 4055]
 *                 id_group:
 *                   type: integer
 *                   example: 105
 *           examples:
 *             Asignación individual o múltiple:
 *               value:
 *                 data:
 *                   type: asignacion
 *                   attributes:
 *                     lista_egresados: [2034, 4055]
 *             Asignación por grupo:
 *               value:
 *                 data:
 *                   type: asignacion
 *                   attributes:
 *                     id_group: 105
 *     SurveyAssignmentParticipant:
 *       description: Participante asignado a una encuesta, con estado de acceso y respuesta.
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           example: participante
 *         id:
 *           type: string
 *           example: 550e8400-e29b-41d4-a716-446655440000
 *         attributes:
 *           type: object
 *           properties:
 *             is_active:
 *               type: boolean
 *               description: true=acceso vigente, false=acceso revocado
 *               example: true
 *             estado_respuesta:
 *               type: string
 *               description: Estado de la respuesta del egresado (contestada o pendiente)
 *               example: contestada
 *             fecha_respuesta:
 *               type: string
 *               description: Fecha en que el egresado contestó la encuesta (si aplica)
 *               example: 2025-10-25T14:30:00Z
 *             egresado:
 *               type: object
 *               description: Datos básicos del egresado asignado
 *               properties:
 *                 nombre:
 *                   type: string
 *                   example: Maria
 *                 primer_apellido:
 *                   type: string
 *                   example: Gonzalez
 *                 segundo_apellido:
 *                   type: string
 *                   example: Lopez
 *                 matricula:
 *                   type: string
 *                   example: 20210055
 *                 email:
 *                   type: string
 *                   example: maria@email.com
 *     SurveyAssignmentListResponse:
 *       description: Respuesta paginada con la lista de participantes asignados a una encuesta.
 *       type: object
 *       properties:
 *         meta:
 *           type: object
 *           properties:
 *             total_records:
 *               type: integer
 *               description: Total de participantes encontrados
 *               example: 85
 *             page:
 *               type: integer
 *               description: Página actual
 *               example: 1
 *             limit:
 *               type: integer
 *               description: Límite de resultados por página
 *               example: 20
 *         data:
 *           type: array
 *           description: Lista de participantes
 *           items:
 *             $ref: '#/components/schemas/SurveyAssignmentParticipant'
 *
 * /api/encuestas/{id}/asignar:
 *   post:
 *     summary: Asigna egresados a una encuesta (individual, múltiple o por grupo)
 *     description: |
 *       Asigna acceso a una encuesta a uno o varios egresados, o a todos los miembros de un grupo. Si un egresado ya tenía acceso y estaba revocado, se reactiva. Si ya estaba activo, se omite.
 *       
 *       **Instrucciones:**
 *       - Para asignar egresados individuales, envía un array en `lista_egresados`.
 *       - Para asignar por grupo, envía el campo `id_group`.
 *       - El campo `type` debe ser "asignacion".
 *       - El endpoint responde con la cantidad de accesos creados, reactivados y omitidos.
 *       
 *       **Ejemplo de requestBody:**
 *       {
 *         "data": {
 *           "type": "asignacion",
 *           "attributes": {
 *             "lista_egresados": [2034, 4055]
 *           }
 *         }
 *       }
 *     tags:
 *       - SurveyAssignment
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
 *             $ref: '#/components/schemas/SurveyAssignmentInput'
 *           examples:
 *             Asignación individual o múltiple:
 *               value:
 *                 data:
 *                   type: asignacion
 *                   attributes:
 *                     lista_egresados: [2034, 4055]
 *             Asignación por grupo:
 *               value:
 *                 data:
 *                   type: asignacion
 *                   attributes:
 *                     id_group: 105
 *     responses:
 *       200:
 *         description: |
 *           Asignación exitosa. Devuelve la cantidad de accesos creados, reactivados y omitidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   example: { created: 2, reactivated: 1, skipped: 0 }
 *       400:
 *         description: Bad Request. El formato o los datos enviados no son válidos.
 *
 * /api/encuestas/{id}/participantes:
 *   get:
 *     summary: Lista los participantes asignados a una encuesta
 *     description: |
 *       Devuelve la lista paginada de egresados asignados a la encuesta, con su estado de acceso y respuesta.
 *       
 *       **Instrucciones:**
 *       - Puedes filtrar por acceso (activos, revocados, todos), estado de respuesta (pendiente, contestada) y búsqueda por nombre/matrícula/email.
 *       - Usa los parámetros `page` y `limit` para paginación.
 *       - El campo `meta` indica el total de resultados y la página actual.
 *     tags:
 *       - SurveyAssignment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *         example: 20
 *       - name: filtro_acceso
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [activos, revocados, todos]
 *         example: activos
 *       - name: estado_respuesta
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pendiente, contestada]
 *         example: pendiente
 *       - name: busqueda
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         example: Maria
 *     responses:
 *       200:
 *         description: |
 *           Listado de participantes asignados, filtrado y paginado según los parámetros enviados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyAssignmentListResponse'
 *
 * /api/encuestas/{id}/participantes/{uuid}:
 *   delete:
 *     summary: Revoca el acceso de un participante a la encuesta
 *     description: |
 *       Revoca el acceso de un egresado a la encuesta. El uuid es el identificador único de la asignación (no del egresado).
 *       
 *       **Instrucciones:**
 *       - El acceso revocado no elimina el registro, solo lo marca como inactivo.
 *       - Si el uuid no existe o ya está revocado, la operación es idempotente.
 *     tags:
 *       - SurveyAssignment
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - name: uuid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       204:
 *         description: Acceso revocado correctamente. No hay contenido en la respuesta.
 *       400:
 *         description: Bad Request. El uuid o id no son válidos.
 */
