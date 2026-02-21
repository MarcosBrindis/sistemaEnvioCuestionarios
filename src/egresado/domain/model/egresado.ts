export interface Egresado {
  id_egresado?: number;
  nombre: string;
  primer_apellido: string;
  segundo_apellido: string | null;
  matricula: string;
  curp: string;
  email: string | null;
  imagen_egresado: string | null;
  sinopsis: string | null;
  fecha_nacimiento: string | null;
  is_active: boolean;
  id_estado: number;
  id_programa_educativo: number | null;
  id_periodo: number | null;
}

export enum EstadoEgresado {
  PENDIENTE = 'pendiente',
  RECHAZADO = 'rechazado',
  APROBADO = 'aprobado'
}

export interface EstadoEgresadoCatalogo {
  id_estado: number;
  nombre: string;
  descripcion: string;
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