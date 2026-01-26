export interface EmailTemplate {
  id_template: number;
  asunto: string;
  cuerpo: string;
  layout_html?: string | null;
}
