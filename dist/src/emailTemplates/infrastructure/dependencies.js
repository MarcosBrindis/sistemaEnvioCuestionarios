"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = exports.deleteEmailTemplate = exports.updateEmailTemplate = exports.getEmailTemplateById = exports.getEmailTemplates = exports.createEmailTemplate = void 0;
const CreateEmailTemplate_1 = require("../application/usecase/CreateEmailTemplate");
const GetEmailTemplates_1 = require("../application/usecase/GetEmailTemplates");
const GetEmailTemplateById_1 = require("../application/usecase/GetEmailTemplateById");
const UpdateEmailTemplate_1 = require("../application/usecase/UpdateEmailTemplate");
const DeleteEmailTemplate_1 = require("../application/usecase/DeleteEmailTemplate");
const EmailTemplateRepositoryMySQL_1 = require("./database/mysql/EmailTemplateRepositoryMySQL");
const emailTemplateRepository = new EmailTemplateRepositoryMySQL_1.EmailTemplateRepositoryMySQL();
exports.createEmailTemplate = new CreateEmailTemplate_1.CreateEmailTemplate(emailTemplateRepository);
exports.getEmailTemplates = new GetEmailTemplates_1.GetEmailTemplates(emailTemplateRepository);
exports.getEmailTemplateById = new GetEmailTemplateById_1.GetEmailTemplateById(emailTemplateRepository);
exports.updateEmailTemplate = new UpdateEmailTemplate_1.UpdateEmailTemplate(emailTemplateRepository);
exports.deleteEmailTemplate = new DeleteEmailTemplate_1.DeleteEmailTemplate(emailTemplateRepository);
exports.dependencies = {
    createEmailTemplate: exports.createEmailTemplate,
    getEmailTemplates: exports.getEmailTemplates,
    getEmailTemplateById: exports.getEmailTemplateById,
    updateEmailTemplate: exports.updateEmailTemplate,
    deleteEmailTemplate: exports.deleteEmailTemplate,
};
