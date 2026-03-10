import { DatosDomiciliarios, CreateDatosDomiciliariosDTO, UpdateDatosDomiciliariosDTO } from "../model/datosDomiciliarios";

export interface DatosDomiciliariosRepository {
  create(datos: CreateDatosDomiciliariosDTO): Promise<DatosDomiciliarios>;

  getByEgresadoId(idEgresado: number): Promise<DatosDomiciliarios | null>;

  update(idEgresado: number, datos: UpdateDatosDomiciliariosDTO): Promise<DatosDomiciliarios>;

  delete(idEgresado: number): Promise<boolean>;

  existsByEgresadoId(idEgresado: number): Promise<boolean>;
}
