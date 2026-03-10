import { DatosLaboralesRepository } from "../../domain/port/DatosLaboralesRepository";
import { UpdateDatosLaboralesDTO, DatosLaborales } from "../../domain/model/datosLaborales";

export class UpdateDatosLaborales {
  constructor(private readonly repository: DatosLaboralesRepository) {}

  async execute(idEgresado: number, datos: UpdateDatosLaboralesDTO): Promise<DatosLaborales> {
    const exists = await this.repository.existsByEgresadoId(idEgresado);
    
    if (!exists) {
      throw new Error("No se encontraron datos laborales para este egresado.");
    }

    return await this.repository.update(idEgresado, datos);
  }
}
