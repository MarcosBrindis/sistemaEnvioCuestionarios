"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = exports.academicAchievementRepository = void 0;
const AcademicAchievementRepositoryMySQL_1 = require("./database/mysql/AcademicAchievementRepositoryMySQL");
exports.academicAchievementRepository = new AcademicAchievementRepositoryMySQL_1.AcademicAchievementRepositoryMySQL();
exports.dependencies = {
    academicAchievementRepository: exports.academicAchievementRepository,
};
