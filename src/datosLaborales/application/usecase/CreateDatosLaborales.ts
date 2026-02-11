import { DatosLaboralesRepository } from "../../domain/port/DatosLaboralesRepository";
import { CreateDatosLaboralesDTO, DatosLaborales } from "../../domain/model/datosLaborales";

export class CreateDatosLaborales {
  constructor(private readonly repository: DatosLaboralesRepository) {}

  async execute(datos: CreateDatosLaboralesDTO): Promise<DatosLaborales> {
    const exists = await this.repository.existsByEgresadoId(datos.id_egresado);
    
    if (exists) {
      throw new Error("El egresado ya tiene datos laborales registrados. Utiliza la opción de actualización.");
    }

    return await this.repository.create(datos);
  }
}
