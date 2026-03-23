"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseQuestionRepository = void 0;
class BaseQuestionRepository {
    create(_data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    update(_id, _data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    delete(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findById(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findAll() {
        return Promise.reject(new Error('Method not implemented'));
    }
    findByTypeQuestionId(_idTipoPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    searchByText(_texto) {
        return Promise.reject(new Error('Method not implemented'));
    }
    typeQuestionExists(_idTipoPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    getTypeQuestionName(_idTipoPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    countOptionsByQuestionId(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    hasLikertOptions() {
        return Promise.reject(new Error('Method not implemented'));
    }
    getQuestionWithOptions(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    getAllQuestionsWithOptions() {
        return Promise.reject(new Error('Method not implemented'));
    }
    getLikertOptions() {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseQuestionRepository = BaseQuestionRepository;
