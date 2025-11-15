import { FormularioRepository } from '../../domain/port/formRepository';
import { Formulario } from '../../domain/model/form';

export class GetFormularioById {
  constructor(private repo: FormularioRepository) {}

  async execute(id: number): Promise<(Formulario & { preguntas?: Array<{ id_pregunta: number; orden: number }> }) | null> {
    const form = await this.repo.findById(id);
    if (!form) return null;
    const preguntas = await this.repo.getQuestionsByForm(id);
    return { ...form, preguntas };
  }
}

export class GetAllFormularios {
  constructor(private repo: FormularioRepository) {}

  async execute(): Promise<Formulario[]> {
    return await this.repo.findAll();
  }
}
