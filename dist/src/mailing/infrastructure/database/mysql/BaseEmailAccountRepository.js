"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseEmailAccountRepository = void 0;
class BaseEmailAccountRepository {
    create(_account) {
        return Promise.reject(new Error('Not implemented'));
    }
    update(_id, _data) {
        return Promise.reject(new Error('Not implemented'));
    }
    findAll() {
        return Promise.reject(new Error('Not implemented'));
    }
    deactivate(_id) {
        return Promise.reject(new Error('Not implemented'));
    }
}
exports.BaseEmailAccountRepository = BaseEmailAccountRepository;
