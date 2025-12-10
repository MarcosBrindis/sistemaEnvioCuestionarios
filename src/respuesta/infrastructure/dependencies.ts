import { RespuestaRepositoryMySQL } from './database/mysql/RespuestaRepositoryMySQL';
import { RespuestaRepository } from '../domain/port/respuestaRepository';

export const respuestaRepository: RespuestaRepository = new RespuestaRepositoryMySQL();
