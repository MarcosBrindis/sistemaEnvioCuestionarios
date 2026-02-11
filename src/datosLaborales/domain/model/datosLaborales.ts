export interface SectorEconomico {
  id_sector: number;
  nombre: string;
  descripcion: string;
}

export interface DatosLaborales {
  id_datos_laborales?: number;
  trabaja_actualmente: boolean;
  nombre_empresa: string | null;
  puesto: string | null;
  id_sector: number | null;
  actividad_principal: string | null;
  id_egresado: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}

export interface CreateDatosLaboralesDTO {
  trabaja_actualmente: boolean;
  nombre_empresa?: string | null;
  puesto?: string | null;
  id_sector?: number | null;
  actividad_principal?: string | null;
  id_egresado: number;
}

export interface UpdateDatosLaboralesDTO {
  trabaja_actualmente?: boolean;
  nombre_empresa?: string | null;
  puesto?: string | null;
  id_sector?: number | null;
  actividad_principal?: string | null;
}
