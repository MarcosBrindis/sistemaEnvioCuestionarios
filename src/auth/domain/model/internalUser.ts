import { SessionRole } from './session';

export interface InternalUserAuth {
  id_usuario: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol: Exclude<SessionRole, 'egresado'>;
}
