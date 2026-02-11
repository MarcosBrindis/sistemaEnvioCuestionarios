import { DatosLaborales, CreateDatosLaboralesDTO, UpdateDatosLaboralesDTO } from "../model/datosLaborales";

export interface DatosLaboralesRepository {
  create(datos: CreateDatosLaboralesDTO): Promise<DatosLaborales>;

  getByEgresadoId(idEgresado: number): Promise<DatosLaborales | null>;

  update(idEgresado: number, datos: UpdateDatosLaboralesDTO): Promise<DatosLaborales>;

  delete(idEgresado: number): Promise<boolean>;

  existsByEgresadoId(idEgresado: number): Promise<boolean>;
}
