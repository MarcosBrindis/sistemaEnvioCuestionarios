"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentDependencies = void 0;
const AssignmentRepositoryMySQL_1 = require("./database/mysql/AssignmentRepositoryMySQL");
const AssignSurvey_1 = require("../application/usecase/AssignSurvey");
const AssignSurveyGroup_1 = require("../application/usecase/AssignSurveyGroup");
const ListSurveyParticipants_1 = require("../application/usecase/ListSurveyParticipants");
const RevokeSurveyAccess_1 = require("../application/usecase/RevokeSurveyAccess");
const GetGroupsAssignedToSurvey_1 = require("../application/usecase/GetGroupsAssignedToSurvey");
const assignmentRepository = new AssignmentRepositoryMySQL_1.AssignmentRepositoryMySQL();
const assignSurvey = new AssignSurvey_1.AssignSurvey(assignmentRepository);
const assignSurveyGroup = new AssignSurveyGroup_1.AssignSurveyGroup(assignmentRepository);
const listSurveyParticipants = new ListSurveyParticipants_1.ListSurveyParticipants(assignmentRepository);
const revokeSurveyAccess = new RevokeSurveyAccess_1.RevokeSurveyAccess(assignmentRepository);
const getGroupsAssignedToSurvey = new GetGroupsAssignedToSurvey_1.GetGroupsAssignedToSurvey(assignmentRepository);
exports.assignmentDependencies = {
    assignSurvey,
    assignSurveyGroup,
    listSurveyParticipants,
    revokeSurveyAccess,
    getGroupsAssignedToSurvey,
};
