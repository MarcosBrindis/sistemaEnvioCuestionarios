import { DatosLaboralesRepositoryMySQL } from "./database/mysql/DatosLaboralesRepositoryMySQL";
import { CreateDatosLaborales } from "../application/usecase/CreateDatosLaborales";
import { GetDatosLaboralesByEgresado } from "../application/usecase/GetDatosLaboralesByEgresado";
import { UpdateDatosLaborales } from "../application/usecase/UpdateDatosLaborales";
import { DeleteDatosLaborales } from "../application/usecase/DeleteDatosLaborales";

const datosLaboralesRepo = new DatosLaboralesRepositoryMySQL();

export const dependencies = {
  datosLaboralesRepository: datosLaboralesRepo,
  createDatosLaborales: new CreateDatosLaborales(datosLaboralesRepo),
  getDatosLaboralesByEgresado: new GetDatosLaboralesByEgresado(datosLaboralesRepo),
  updateDatosLaborales: new UpdateDatosLaborales(datosLaboralesRepo),
  deleteDatosLaborales: new DeleteDatosLaborales(datosLaboralesRepo)
};
