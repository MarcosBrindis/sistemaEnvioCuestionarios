"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSurveyRepository = void 0;
class BaseSurveyRepository {
    findAll(_params) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findById(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    create(_survey) {
        return Promise.reject(new Error('Method not implemented'));
    }
    update(_id, _data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    delete(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    existsActiveByName(_name) {
        return Promise.reject(new Error('Method not implemented'));
    }
    hasResponses(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
    canChangeForm(_id) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseSurveyRepository = BaseSurveyRepository;
