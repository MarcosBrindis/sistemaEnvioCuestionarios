import { DatosLaboralesRepository } from "../../domain/port/DatosLaboralesRepository";
import { DatosLaborales } from "../../domain/model/datosLaborales";

export class GetDatosLaboralesByEgresado {
  constructor(private readonly repository: DatosLaboralesRepository) {}

  async execute(idEgresado: number): Promise<DatosLaborales | null> {
    return await this.repository.getByEgresadoId(idEgresado);
  }
}
