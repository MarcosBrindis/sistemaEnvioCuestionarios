export interface Respuesta {
  id_respuesta?: number;
  id_egresado: number;
  id_formulario: number;
  fecha_respuesta?: string;
  respuestas_json: any;
}
