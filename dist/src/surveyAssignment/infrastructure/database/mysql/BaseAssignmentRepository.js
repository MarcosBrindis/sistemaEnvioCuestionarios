"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAssignmentRepository = void 0;
class BaseAssignmentRepository {
    assignToGraduates(_idEncuesta, _egresados) {
        return Promise.reject(new Error('Method not implemented'));
    }
    listParticipants(_idEncuesta, _options) {
        return Promise.reject(new Error('Method not implemented'));
    }
    revokeAccess(_uuid) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseAssignmentRepository = BaseAssignmentRepository;
