import { AuthRepository } from '../../domain/port/authRepository';
import { SessionUser } from '../../domain/model/session';

export interface LoginResult {
  user: SessionUser;
  email: string | null;
}

export class LoginEgresado {
  constructor(private authRepo: AuthRepository) {}

  async execute(matricula: string, curp: string): Promise<LoginResult | null> {
    const egresado = await this.authRepo.validateCredentials(matricula, curp);
    if (!egresado) return null;
    return {
      user: {
        id: egresado.id_egresado!,
        nombre: egresado.nombre + ' ' + egresado.primer_apellido,
        rol: 'egresado',
      },
      email: egresado.email || null,
    };
  }
}
