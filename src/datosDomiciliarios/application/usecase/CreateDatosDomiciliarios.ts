import { DatosDomiciliariosRepository } from "../../domain/port/DatosDomiciliariosRepository";
import { CreateDatosDomiciliariosDTO, DatosDomiciliarios } from "../../domain/model/datosDomiciliarios";

export class CreateDatosDomiciliarios {
  constructor(private readonly repository: DatosDomiciliariosRepository) {}

  async execute(datos: CreateDatosDomiciliariosDTO): Promise<DatosDomiciliarios> {
    const exists = await this.repository.existsByEgresadoId(datos.id_egresado);
    
    if (exists) {
      throw new Error("El egresado ya tiene datos domiciliarios registrados. Utiliza la opción de actualización.");
    }

    return await this.repository.create(datos);
  }
}
