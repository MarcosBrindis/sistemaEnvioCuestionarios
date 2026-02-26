import bcrypt from 'bcrypt';
import { AuthRepository } from '../../domain/port/authRepository';
import { SessionUser } from '../../domain/model/session';

export interface LoginStaffResult {
  user: SessionUser;
}

export class LoginStaff {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<LoginStaffResult | null> {
    const staff = await this.authRepo.validateInternalCredentials(email);
    if (!staff) return null;

    const isValid = await bcrypt.compare(password, staff.password_hash);
    if (!isValid) return null;

    return {
      user: {
        id: staff.id_usuario,
        nombre: staff.nombre,
        rol: staff.rol,
        tipo: 'interno',
        email: staff.email,
      },
    };
  }
}
