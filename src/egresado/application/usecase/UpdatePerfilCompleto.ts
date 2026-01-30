import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { Egresado } from '../../domain/model/egresado';

export interface UpdatePerfilCompletoDTO {
  id: number;
  nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string | null;
  email?: string;
  fecha_nacimiento?: string;
  imagen_egresado?: string;
  id_programa_educativo?: number;
  id_periodo?: number;
  id_estado?: number;
  sessionEgresadoId: number;
}

export class UpdatePerfilCompleto {
  constructor(private egresadoRepository: EgresadoRepository) {}

  async execute(dto: UpdatePerfilCompletoDTO): Promise<Egresado> {
    if (dto.id !== dto.sessionEgresadoId) {
      throw new Error('No autorizado para editar este perfil');
    }

    const egresado = await this.egresadoRepository.findById(dto.id);
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    const updateData: Partial<Pick<Egresado, 'nombre' | 'primer_apellido' | 'segundo_apellido' | 'email' | 'fecha_nacimiento' | 'imagen_egresado' | 'id_programa_educativo' | 'id_periodo' | 'id_estado'>> = {};

    if (dto.nombre !== undefined) {
      if (typeof dto.nombre !== 'string' || dto.nombre.trim().length === 0) {
        throw new Error('Nombre inválido');
      }
      updateData.nombre = dto.nombre.trim();
    }

    if (dto.primer_apellido !== undefined) {
      if (typeof dto.primer_apellido !== 'string' || dto.primer_apellido.trim().length === 0) {
        throw new Error('Primer apellido inválido');
      }
      updateData.primer_apellido = dto.primer_apellido.trim();
    }

    if (dto.segundo_apellido !== undefined) {
      updateData.segundo_apellido = dto.segundo_apellido ? dto.segundo_apellido.trim() : null;
    }

    if (dto.email !== undefined) {
      if (typeof dto.email === 'string' && dto.email.length > 0) {
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(dto.email)) {
          throw new Error('Email inválido');
        }
        updateData.email = dto.email;
      }
    }

    if (dto.fecha_nacimiento !== undefined) {
      if (typeof dto.fecha_nacimiento === 'string' && dto.fecha_nacimiento.length > 0) {
        // Validar formato de fecha
        const fecha = new Date(dto.fecha_nacimiento);
        if (isNaN(fecha.getTime())) {
          throw new Error('Fecha de nacimiento inválida');
        }
        updateData.fecha_nacimiento = dto.fecha_nacimiento;
      }
    }

    if (dto.imagen_egresado !== undefined) {
      if (typeof dto.imagen_egresado === 'string' && dto.imagen_egresado.length > 0) {
        if (dto.imagen_egresado.length > 4294967295) {
          throw new Error('La URL de la imagen es demasiado larga');
        }
        updateData.imagen_egresado = dto.imagen_egresado;
      }
    }

    if (dto.id_programa_educativo !== undefined) {
      if (typeof dto.id_programa_educativo === 'number' && dto.id_programa_educativo > 0) {
        updateData.id_programa_educativo = dto.id_programa_educativo;
      }
    }

    if (dto.id_periodo !== undefined) {
      if (typeof dto.id_periodo === 'number' && dto.id_periodo > 0) {
        updateData.id_periodo = dto.id_periodo;
      }
    }

    if (dto.id_estado !== undefined) {
      if (![1, 2, 3].includes(dto.id_estado)) {
        throw new Error('Estado de egresado inválido');
      }
      updateData.id_estado = dto.id_estado;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('No se proporcionaron campos válidos para actualizar');
    }

    const egresadoActualizado = await this.egresadoRepository.updatePerfilCompleto(dto.id, updateData);
    return egresadoActualizado;
  }
}
