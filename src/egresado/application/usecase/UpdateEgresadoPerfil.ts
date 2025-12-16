import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { Egresado } from '../../domain/model/egresado';

export interface UpdateEgresadoPerfilDTO {
  id: number;
  email?: string;
  fecha_nacimiento?: string;
  imagen_egresado?: string;
  sessionEgresadoId: number;
}

export class UpdateEgresadoPerfil {
  constructor(private egresadoRepository: EgresadoRepository) {}

  async execute(dto: UpdateEgresadoPerfilDTO): Promise<Egresado> {
    if (dto.id !== dto.sessionEgresadoId) {
      throw new Error('No autorizado para editar este perfil');
    }

    const updateData: Partial<Egresado> = {};
    if (dto.email !== undefined) {
      updateData.email = dto.email;
    }
    if (dto.fecha_nacimiento !== undefined) {
      updateData.fecha_nacimiento = dto.fecha_nacimiento;
    }
    if (dto.imagen_egresado !== undefined) {
      if (typeof dto.imagen_egresado !== 'string') {
        throw new Error('La imagen debe ser una URL válida');
      }
      if (dto.imagen_egresado.length > 4294967295) {
        throw new Error('La URL de la imagen es demasiado larga');
      }
      updateData.imagen_egresado = dto.imagen_egresado;
    }

    const egresadoActualizado = await this.egresadoRepository.updatePerfil(dto.id, updateData);
    return egresadoActualizado;
  }
}
