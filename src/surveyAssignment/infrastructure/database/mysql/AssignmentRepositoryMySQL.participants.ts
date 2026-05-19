import { MysqlConnection } from '../../../../core/db/mysl/connection';

export async function listParticipantsQuery(
  idEncuesta: number,
  options: {
    page: number;
    limit: number;
    filtro_acceso?: 'activos' | 'revocados' | 'todos';
    estado_respuesta?: 'pendiente' | 'contestada';
    busqueda?: string;
  }
) {
  const offset = (options.page - 1) * options.limit;
  let where = 'ee.id_encuesta = ?';
  const params: any[] = [idEncuesta];

  if (options.filtro_acceso === 'activos') {
    where += ' AND ee.is_active = 1';
  } else if (options.filtro_acceso === 'revocados') {
    where += ' AND ee.is_active = 0';
  }
  if (options.estado_respuesta === 'pendiente') {
    where += ' AND r.id_respuesta IS NULL';
  } else if (options.estado_respuesta === 'contestada') {
    where += ' AND r.id_respuesta IS NOT NULL';
  }
  if (options.busqueda) {
    where += ' AND (e.nombre LIKE ? OR e.primer_apellido LIKE ? OR e.matricula LIKE ? OR e.email LIKE ? OR pe.nombre LIKE ?)';
    params.push(
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`,
      `%${options.busqueda}%`
    );
  }

  const sql = `SELECT 
    ee.id_encuesta_egresados as uuid,
    ee.is_active,
    e.nombre, e.primer_apellido, e.segundo_apellido, e.matricula, e.email,
    pe.nombre as programa_educativo,
    gm.id_grupo,
    ge.nombre as grupo_nombre,
    IF(r.id_respuesta IS NOT NULL, 'contestada', 'pendiente') as estado_respuesta,
    r.fecha_respuesta
  FROM encuesta_egresados ee
  INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
  LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo
  LEFT JOIN grupo_miembro gm ON e.id_egresado = gm.id_egresado
  LEFT JOIN grupo_egresado ge ON gm.id_grupo = ge.id_grupo
  LEFT JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta
  LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario)
  WHERE ${where}
  ORDER BY e.nombre ASC
  LIMIT ? OFFSET ?`;
  params.push(options.limit, offset);

  const [rows]: [any[], any] = await MysqlConnection.query(sql, params);
  // Para meta: contar total
  const [countRows]: [any[], any] = await MysqlConnection.query(
    `SELECT COUNT(*) as total FROM encuesta_egresados ee INNER JOIN egresado e ON ee.id_egresado = e.id_egresado LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo LEFT JOIN grupo_miembro gm ON e.id_egresado = gm.id_egresado LEFT JOIN grupo_egresado ge ON gm.id_grupo = ge.id_grupo LEFT JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario) WHERE ${where}`,
    params.slice(0, params.length - 2)
  );
  return {
    meta: {
      total_records: countRows[0]?.total ?? 0,
      page: options.page,
      limit: options.limit,
    },
    data: rows.map(row => ({
      type: 'participante',
      id: row.uuid,
      attributes: {
        is_active: !!row.is_active,
        estado_respuesta: row.estado_respuesta,
        fecha_respuesta: row.fecha_respuesta,
        grupo: row.id_grupo ? {
          id_grupo: row.id_grupo,
          nombre: row.grupo_nombre
        } : null,
        egresado: {
          nombre: row.nombre,
          primer_apellido: row.primer_apellido,
          segundo_apellido: row.segundo_apellido,
          matricula: row.matricula,
          email: row.email,
            programa_educativo: row.programa_educativo ?? null,
        }
      }
    }))
  };
}
