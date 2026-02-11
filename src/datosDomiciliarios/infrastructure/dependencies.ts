import { DatosDomiciliariosRepositoryMySQL } from "./database/mysql/DatosDomiciliariosRepositoryMySQL";
import { CreateDatosDomiciliarios } from "../application/usecase/CreateDatosDomiciliarios";
import { GetDatosDomiciliariosByEgresado } from "../application/usecase/GetDatosDomiciliariosByEgresado";
import { UpdateDatosDomiciliarios } from "../application/usecase/UpdateDatosDomiciliarios";
import { DeleteDatosDomiciliarios } from "../application/usecase/DeleteDatosDomiciliarios";

const datosDomiciliariosRepo = new DatosDomiciliariosRepositoryMySQL();

export const dependencies = {
  datosDomiciliariosRepository: datosDomiciliariosRepo,
  createDatosDomiciliarios: new CreateDatosDomiciliarios(datosDomiciliariosRepo),
  getDatosDomiciliariosByEgresado: new GetDatosDomiciliariosByEgresado(datosDomiciliariosRepo),
  updateDatosDomiciliarios: new UpdateDatosDomiciliarios(datosDomiciliariosRepo),
  deleteDatosDomiciliarios: new DeleteDatosDomiciliarios(datosDomiciliariosRepo)
};
