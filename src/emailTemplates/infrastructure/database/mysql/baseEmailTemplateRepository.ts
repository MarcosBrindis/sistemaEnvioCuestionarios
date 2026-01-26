import { EmailTemplateRepository } from '../../../domain/port/emailTemplateRepository';
import { EmailTemplate } from '../../../domain/model/emailTemplate';

export abstract class BaseEmailTemplateRepository implements EmailTemplateRepository {
  findAll(): Promise<EmailTemplate[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
  findById(_id: number): Promise<EmailTemplate | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  create(_template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate> {
    return Promise.reject(new Error('Method not implemented'));
  }
  update(_id: number, _template: Omit<EmailTemplate, 'id'>): Promise<EmailTemplate | null> {
    return Promise.reject(new Error('Method not implemented'));
  }
  delete(_id: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
  isLinkedToSurvey(_id: number): Promise<boolean> {
    return Promise.reject(new Error('Method not implemented'));
  }
}
