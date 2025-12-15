export interface SessionUser {
  id: number;
  nombre: string;
  rol: 'egresado';
}

export interface SessionData {
  authenticated: boolean;
  user: SessionUser;
}
