"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOpcionPreguntaRepository = void 0;
class BaseOpcionPreguntaRepository {
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
    findByQuestionId(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    // Métodos para validaciones de negocio
    isTextUniqueForQuestion(_idPregunta, _textoOpcion, _excludeId) {
        return Promise.reject(new Error('Method not implemented'));
    }
    isLabelUniqueForQuestion(_idPregunta, _etiqueta, _excludeId) {
        return Promise.reject(new Error('Method not implemented'));
    }
    questionExists(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    getQuestionType(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
    countOptionsByQuestionId(_idPregunta) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseOpcionPreguntaRepository = BaseOpcionPreguntaRepository;
