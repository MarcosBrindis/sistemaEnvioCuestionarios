import { CreateEmailTemplate } from '../application/usecase/CreateEmailTemplate';
import { GetEmailTemplates } from '../application/usecase/GetEmailTemplates';
import { GetEmailTemplateById } from '../application/usecase/GetEmailTemplateById';
import { UpdateEmailTemplate } from '../application/usecase/UpdateEmailTemplate';
import { DeleteEmailTemplate } from '../application/usecase/DeleteEmailTemplate';
import { EmailTemplateRepositoryMySQL } from './database/mysql/EmailTemplateRepositoryMySQL';

const emailTemplateRepository = new EmailTemplateRepositoryMySQL();

export const createEmailTemplate = new CreateEmailTemplate(emailTemplateRepository);
export const getEmailTemplates = new GetEmailTemplates(emailTemplateRepository);
export const getEmailTemplateById = new GetEmailTemplateById(emailTemplateRepository);
export const updateEmailTemplate = new UpdateEmailTemplate(emailTemplateRepository);
export const deleteEmailTemplate = new DeleteEmailTemplate(emailTemplateRepository);
export const dependencies = {
  createEmailTemplate,
  getEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
};

