import { CreateOpcionPregunta } from '../application/usecase/CreateOpcionPregunta';
import { UpdateOpcionPregunta } from '../application/usecase/UpdateOpcionPregunta';
import { DeleteOpcionPregunta } from '../application/usecase/DeleteOpcionPregunta';
import { GetOpcionPreguntaById, GetAllOpcionesPreguntas, GetOpcionPreguntasByQuestionId } from '../application/usecase/GetOpcionPregunta';
import { OpcionPreguntaRepositoryMySQL } from './database/mysql/OpcionPreguntaRepositoryMySQL';

// Instancia del repositorio
const opcionPreguntaRepo = new OpcionPreguntaRepositoryMySQL();

export const dependencies = {
  createOpcionPregunta: new CreateOpcionPregunta(opcionPreguntaRepo),
  updateOpcionPregunta: new UpdateOpcionPregunta(opcionPreguntaRepo),
  deleteOpcionPregunta: new DeleteOpcionPregunta(opcionPreguntaRepo),
  getOpcionPreguntaById: new GetOpcionPreguntaById(opcionPreguntaRepo),
  getAllOpcionesPreguntas: new GetAllOpcionesPreguntas(opcionPreguntaRepo),
  getOpcionPreguntasByQuestionId: new GetOpcionPreguntasByQuestionId(opcionPreguntaRepo),
};
