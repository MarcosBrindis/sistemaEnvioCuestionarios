import { Egresado } from '../../../egresado/domain/model/egresado';
import { InternalUserAuth } from '../model/internalUser';

export interface AuthRepository {
  validateEgresadoCredentials(curp: string): Promise<Egresado | null>;
  validateInternalCredentials(email: string): Promise<InternalUserAuth | null>;
}
