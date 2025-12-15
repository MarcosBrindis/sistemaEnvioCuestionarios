import { Egresado } from '../../../egresado/domain/model/egresado';

export interface AuthRepository {
  /**
   * @returns El egresado si las credenciales son correctas, null si no.
   */
  validateCredentials(matricula: string, curp: string): Promise<Egresado | null>;
}
