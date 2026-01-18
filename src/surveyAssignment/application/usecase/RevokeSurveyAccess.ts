import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class RevokeSurveyAccess {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(uuid: string): Promise<void> {
    return this.assignmentRepo.revokeAccess(uuid);
  }
}
