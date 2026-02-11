export interface DatosDomiciliarios {
  id_datos_domiciliarios?: number;
  calle: string;
  colonia: string;
  numero_exterior: string;
  codigo_postal: string;
  estado: string;
  ciudad: string;
  id_egresado: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface CreateDatosDomiciliariosDTO {
  calle: string;
  colonia: string;
  numero_exterior: string;
  codigo_postal: string;
  estado: string;
  ciudad: string;
  id_egresado: number;
}

export interface UpdateDatosDomiciliariosDTO {
  calle?: string;
  colonia?: string;
  numero_exterior?: string;
  codigo_postal?: string;
  estado?: string;
  ciudad?: string;
}
