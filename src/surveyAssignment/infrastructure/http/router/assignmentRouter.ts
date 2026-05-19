import { Router } from 'express';
import { assignSurveyController } from '../controller/assignSurveyController';
import { assignSurveyGroupController } from '../controller/assignSurveyGroupController';
import { listSurveyParticipantsController } from '../controller/listSurveyParticipantsController';
import { revokeSurveyAccessController } from '../controller/revokeSurveyAccessController';
import { getGroupsAssignedController } from '../controller/getGroupsAssignedController';
import { assignmentDependencies } from '../../dependencies';

const assignmentRouter = Router({ mergeParams: true });
assignmentRouter.post('/asignar', assignSurveyController(assignmentDependencies.assignSurvey));
assignmentRouter.post('/asignar/grupo', assignSurveyGroupController(assignmentDependencies.assignSurveyGroup));
assignmentRouter.get('/participantes', listSurveyParticipantsController(assignmentDependencies.listSurveyParticipants));
assignmentRouter.get('/grupos', getGroupsAssignedController(assignmentDependencies.getGroupsAssignedToSurvey));
assignmentRouter.delete('/participantes/:uuid', revokeSurveyAccessController(assignmentDependencies.revokeSurveyAccess));

export default assignmentRouter;
