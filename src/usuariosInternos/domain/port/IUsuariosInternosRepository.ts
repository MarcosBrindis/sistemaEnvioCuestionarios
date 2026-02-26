import { InternalUser, CreateInternalUserInput, UpdateInternalUserInput } from '../model/InternalUser';

export interface IUsuariosInternosRepository {

  createUser(data: CreateInternalUserInput): Promise<{ id_usuario: number }>;

  getUsers(filters?: {
    id_rol?: number;
    is_active?: boolean;
    search?: string;
  }): Promise<InternalUser[]>;

  getUserById(id_usuario: number): Promise<InternalUser | null>;

  getUserByEmail(email: string): Promise<InternalUser | null>;

  getRoles(): Promise<Array<{
    id_rol: number;
    nombre: string;
  }>>;

  updateUser(id_usuario: number, data: UpdateInternalUserInput): Promise<boolean>;

  changePassword(id_usuario: number, password_hash: string): Promise<boolean>;

  deactivateUser(id_usuario: number): Promise<boolean>;

  assignPrograms(id_usuario: number, id_programas: number[]): Promise<boolean>;

  unassignProgram(id_usuario: number, id_programa: number): Promise<boolean>;

  getUserPrograms(id_usuario: number): Promise<Array<{
    id_programa: number;
    nombre_programa: string;
  }>>;
}
