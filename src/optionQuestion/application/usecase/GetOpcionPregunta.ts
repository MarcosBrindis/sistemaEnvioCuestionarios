import { OpcionPreguntaRepository } from '../../domain/port/opcionPreguntaRepository';
import { OpcionPregunta } from '../../domain/model/opcionPregunta';

export class GetOpcionPreguntaById {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(id: number): Promise<OpcionPregunta | null> {
    return await this.repo.findById(id);
  }
}

export class GetAllOpcionesPreguntas {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(): Promise<OpcionPregunta[]> {
    return await this.repo.findAll();
  }
}

export class GetOpcionPreguntasByQuestionId {
  constructor(private repo: OpcionPreguntaRepository) {}

  async execute(idPregunta: number): Promise<OpcionPregunta[]> {
    return await this.repo.findByQuestionId(idPregunta);
  }
}