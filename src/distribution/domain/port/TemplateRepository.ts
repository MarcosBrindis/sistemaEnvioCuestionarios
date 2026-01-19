import { EmailTemplate } from '../model/EmailTemplate';

export interface TemplateRepository {
  findById(id_template: number): Promise<EmailTemplate | null>;
}
