export type SessionRole = 'super_admin' | 'director_vinculacion' | 'director_programa_educativo';

export interface InternalUser {
  id_usuario: number;
  nombre: string;
  email: string;
  id_rol: number;
  rol_nombre: SessionRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInternalUserInput {
  nombre: string;
  email: string;
  password: string;
  id_rol: number;
}

export interface UpdateInternalUserInput {
  nombre?: string;
  email?: string;
  id_rol?: number;
  is_active?: boolean;
}

export interface ResetPasswordInput {
  new_password: string;
}
