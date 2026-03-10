import { DatosLaboralesRepository } from "../../domain/port/DatosLaboralesRepository";

export class DeleteDatosLaborales {
  constructor(private readonly repository: DatosLaboralesRepository) {}

  async execute(idEgresado: number): Promise<boolean> {
    const exists = await this.repository.existsByEgresadoId(idEgresado);
    
    if (!exists) {
      throw new Error("No se encontraron datos laborales para este egresado.");
    }

    return await this.repository.delete(idEgresado);
  }
}
