import { FormularioRepository } from '../../domain/port/formRepository';
import { Formulario } from '../../domain/model/form';

export class UpdateFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(id: number, data: Partial<Formulario>): Promise<Formulario> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error('El formulario no existe');

    if (data.titulo !== undefined) {
      if (typeof data.titulo !== 'string' || data.titulo.trim() === '') {
        throw new Error('El campo titulo no puede estar vacío');
      }
      data.titulo = data.titulo.trim();
    }

    if (data.descripcion !== undefined && data.descripcion !== null) {
      if (data.descripcion.length > 500) {
        throw new Error('La descripción no puede exceder los 500 caracteres');
      }
    }

    if (data.is_active !== undefined) {
      if (typeof data.is_active !== 'boolean') {
        throw new Error('El campo is_active debe ser true o false explícitamente');
      }
      // si activamos y hay otro activo con mismo título
      if (data.is_active && data.titulo) {
        const other = await this.repo.findActiveByTitle(data.titulo);
        if (other && other.id_formulario !== id) {
          throw new Error('Ya existe un formulario activo con el mismo título');
        }
      }
    }

    return await this.repo.update(id, data);
  }
}
