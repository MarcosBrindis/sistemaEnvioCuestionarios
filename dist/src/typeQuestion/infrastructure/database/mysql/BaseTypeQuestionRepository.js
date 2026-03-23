"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTypeQuestionRepository = void 0;
class BaseTypeQuestionRepository {
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
    findByName(_nombre) {
        return Promise.reject(new Error('Method not implemented'));
    }
    isAssociatedWithQuestions(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseTypeQuestionRepository = BaseTypeQuestionRepository;
