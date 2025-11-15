import { FormularioRepository } from '../../domain/port/formRepository';
import { Formulario } from '../../domain/model/form';

export class CreateFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(data: Omit<Formulario, 'id_formulario' | 'fecha_creacion'>): Promise<Formulario> {
    // Validaciones
    if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
      throw new Error('El campo titulo es obligatorio y no puede estar vacío');
    }
    const titulo = data.titulo.trim();

    if (data.descripcion && data.descripcion.length > 500) {
      throw new Error('La descripción no puede exceder los 500 caracteres');
    }

    if (typeof data.is_active !== 'boolean') {
      throw new Error('El campo is_active debe ser true o false explícitamente');
    }

    // No se deben registrar dos formularios activos con el mismo título
    if (data.is_active) {
      const existing = await this.repo.findActiveByTitle(titulo);
      if (existing) {
        throw new Error('Ya existe un formulario activo con el mismo título');
      }
    }

    const normalized = {
      titulo,
      descripcion: data.descripcion ?? null,
      is_active: data.is_active
    };

    const created = await this.repo.create(normalized);
    return created;
  }
}
