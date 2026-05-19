import { AssignmentRepository } from '../../../domain/port/assignmentRepository';

export abstract class BaseAssignmentRepository implements AssignmentRepository {
  assignToGraduates(_idEncuesta: number, _egresados: number[]): Promise<{ created: number; reactivated: number; skipped: number }> {
    return Promise.reject(new Error('Method not implemented'));
  }
  deactivateAllAssignmentsForSurvey(_idEncuesta: number): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  listParticipants(_idEncuesta: number, _options: any): Promise<{ meta: any; data: any[] }> {
    return Promise.reject(new Error('Method not implemented'));
  }
  revokeAccess(_uuid: string): Promise<void> {
    return Promise.reject(new Error('Method not implemented'));
  }
  getGroupsAssignedToSurvey(_idEncuesta: number): Promise<any[]> {
    return Promise.reject(new Error('Method not implemented'));
  }
}
