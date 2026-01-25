import { ProgramaEducativoRepository } from '../../domain/port/egresadoRepository';

export class GetProgramasEducativos {
  constructor(private repository: ProgramaEducativoRepository) {}

  async execute(): Promise<any[]> {
    return this.repository.findAll();
  }
}
