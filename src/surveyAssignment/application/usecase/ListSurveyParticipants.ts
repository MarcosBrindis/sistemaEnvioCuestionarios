import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class ListSurveyParticipants {
  constructor(private assignmentRepo: AssignmentRepository) {}

  async execute(idEncuesta: number, options: any) {
    return this.assignmentRepo.listParticipants(idEncuesta, options);
  }
}
