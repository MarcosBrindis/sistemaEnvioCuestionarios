import { DatosDomiciliariosRepository } from "../../domain/port/DatosDomiciliariosRepository";

export class DeleteDatosDomiciliarios {
  constructor(private readonly repository: DatosDomiciliariosRepository) {}

  async execute(idEgresado: number): Promise<boolean> {
    const exists = await this.repository.existsByEgresadoId(idEgresado);
    
    if (!exists) {
      throw new Error("No se encontraron datos domiciliarios para este egresado.");
    }

    return await this.repository.delete(idEgresado);
  }
}
