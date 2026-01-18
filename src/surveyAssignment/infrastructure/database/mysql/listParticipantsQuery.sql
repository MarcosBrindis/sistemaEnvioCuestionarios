SELECT 
  ee.id_encuesta_egresados as uuid,
  ee.is_active,
  e.nombre, e.primer_apellido, e.segundo_apellido, e.matricula, e.email,
  IF(r.id_respuesta IS NOT NULL, 'contestada', 'pendiente') as estado_respuesta,
  r.fecha_respuesta
FROM encuesta_egresados ee
INNER JOIN egresado e ON ee.id_egresado = e.id_egresado
LEFT JOIN encuesta ON encuesta.id_encuesta = ee.id_encuesta
LEFT JOIN respuesta r ON (r.id_egresado = e.id_egresado AND r.id_formulario = encuesta.id_formulario)
WHERE 
  ee.id_encuesta = ?
-- Filtros dinámicos aquí
ORDER BY e.nombre ASC
LIMIT ? OFFSET ?;
