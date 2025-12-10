export interface Egresado {
  id_egresado?: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  matricula: string;
  curp: string;
  email: string | null;
  imagen_egresado: string | null;
  fecha_nacimiento: string | null;
  is_active: boolean;
  id_programa_educativo: number | null;
  id_periodo: number | null;
}
export interface EgresadoExternoDTO {
  Matricula: string;
  CURP: string;
  Nombre: string;
  apaterno: string;
  amaterno: string;
  FechaNacimiento: string;
  CorreoElectronico: string;
  Carrera: string;
  carrera_id: string;
  UltimoPeriodoID: string;
  UltimoPeriodo: string;
}