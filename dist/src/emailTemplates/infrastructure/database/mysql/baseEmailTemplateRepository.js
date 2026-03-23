"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmailTemplateRepository = void 0;
class BaseEmailTemplateRepository {
    findAll() {
        return Promise.reject(new Error('Method not implemented'));
    }
    findById(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    create(_template) {
        return Promise.reject(new Error('Method not implemented'));
    }
    update(_id, _template) {
        return Promise.reject(new Error('Method not implemented'));
    }
    delete(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    isLinkedToSurvey(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseEmailTemplateRepository = BaseEmailTemplateRepository;
