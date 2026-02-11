import { DatosDomiciliariosRepository } from "../../domain/port/DatosDomiciliariosRepository";
import { UpdateDatosDomiciliariosDTO, DatosDomiciliarios } from "../../domain/model/datosDomiciliarios";

export class UpdateDatosDomiciliarios {
  constructor(private readonly repository: DatosDomiciliariosRepository) {}

  async execute(idEgresado: number, datos: UpdateDatosDomiciliariosDTO): Promise<DatosDomiciliarios> {
    const exists = await this.repository.existsByEgresadoId(idEgresado);
    
    if (!exists) {
      throw new Error("No se encontraron datos domiciliarios para este egresado.");
    }

    return await this.repository.update(idEgresado, datos);
  }
}
