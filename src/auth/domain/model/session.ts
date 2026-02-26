export type SessionRole =
  | 'egresado'
  | 'super_admin'
  | 'director_vinculacion'
  | 'director_programa_educativo';

export interface SessionUser {
  id: number;
  nombre: string;
  rol: SessionRole;
  tipo: 'egresado' | 'interno';
  email?: string | null;
}

export interface SessionData {
  authenticated: boolean;
  user: SessionUser | null;
}
