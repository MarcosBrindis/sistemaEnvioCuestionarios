export interface SurveyAssignmentRepository {
  findByUuid(uuid: string): Promise<{
    id_encuesta_egresados: string;
    is_active: boolean;
    id_egresado: number;
    id_encuesta: number;
    id_formulario: number;
    nombre_encuesta: string;
    descripcion_encuesta: string | null;
    titulo_formulario: string | null;
  } | null>;
}
