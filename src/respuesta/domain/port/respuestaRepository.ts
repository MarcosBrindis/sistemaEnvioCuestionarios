import { Respuesta } from '../model/respuesta';

export interface RespuestaRepository {
  create(data: Omit<Respuesta, 'id_respuesta' | 'fecha_respuesta'>): Promise<Respuesta>;
  findAll(filters?: { id_formulario?: number; id_egresado?: number }): Promise<Respuesta[]>;
  findById(id: number): Promise<Respuesta | null>;
  delete(id: number): Promise<void>;
  existsByEgresadoAndFormulario(id_egresado: number, id_formulario: number): Promise<boolean>;
}
