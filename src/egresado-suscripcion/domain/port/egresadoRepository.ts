export interface EgresadoRepository {
  setActivo(id_egresado: number, activo: boolean): Promise<void>;
}
