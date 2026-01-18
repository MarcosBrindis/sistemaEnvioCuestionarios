import { BajaCorreo } from '../model/bajaCorreo';

export interface BajaCorreoRepository {
  registrarBaja(id_egresado: number, motivo: string): Promise<BajaCorreo>;
  eliminarBaja(id_egresado: number): Promise<void>;
  existeBaja(id_egresado: number): Promise<boolean>;
}
