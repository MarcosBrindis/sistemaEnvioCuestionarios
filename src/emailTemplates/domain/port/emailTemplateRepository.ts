import { EmailTemplate } from '../model/emailTemplate';

export interface EmailTemplateRepository {
  findAll(): Promise<EmailTemplate[]>;
  findById(id: number): Promise<EmailTemplate | null>;
  create(template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate>;
  update(id: number, template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate | null>;
  delete(id: number): Promise<boolean>;
  isLinkedToSurvey(id: number): Promise<boolean>;
}
