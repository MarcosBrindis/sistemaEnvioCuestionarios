export interface Formulario {
  id_formulario?: number;
  titulo: string;
  descripcion?: string | null;
  fecha_creacion?: string;
  is_active: boolean;
}
