import { DatosDomiciliariosRepository } from "../../domain/port/DatosDomiciliariosRepository";
import { DatosDomiciliarios } from "../../domain/model/datosDomiciliarios";

export class GetDatosDomiciliariosByEgresado {
  constructor(private readonly repository: DatosDomiciliariosRepository) {}

  async execute(idEgresado: number): Promise<DatosDomiciliarios | null> {
    return await this.repository.getByEgresadoId(idEgresado);
  }
}
