import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class GetGroupsAssignedToSurvey {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(idEncuesta: number) {
    return this.assignmentRepo.getGroupsAssignedToSurvey(idEncuesta);
  }
}
