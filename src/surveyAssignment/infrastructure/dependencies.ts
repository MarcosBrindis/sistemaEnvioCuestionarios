import { AssignmentRepositoryMySQL } from './database/mysql/AssignmentRepositoryMySQL';
import { AssignSurvey } from '../application/usecase/AssignSurvey';
import { AssignSurveyGroup } from '../application/usecase/AssignSurveyGroup';
import { ListSurveyParticipants } from '../application/usecase/ListSurveyParticipants';
import { RevokeSurveyAccess } from '../application/usecase/RevokeSurveyAccess';

const assignmentRepository = new AssignmentRepositoryMySQL();
const assignSurvey = new AssignSurvey(assignmentRepository);
const assignSurveyGroup = new AssignSurveyGroup(assignmentRepository);
const listSurveyParticipants = new ListSurveyParticipants(assignmentRepository);
const revokeSurveyAccess = new RevokeSurveyAccess(assignmentRepository);

export const assignmentDependencies = {
  assignSurvey,
  assignSurveyGroup,
  listSurveyParticipants,
  revokeSurveyAccess,
};
