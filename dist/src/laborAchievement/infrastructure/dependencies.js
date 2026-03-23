"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = exports.laborAchievementRepository = void 0;
const LaborAchievementRepositoryMySQL_1 = require("./database/mysql/LaborAchievementRepositoryMySQL");
exports.laborAchievementRepository = new LaborAchievementRepositoryMySQL_1.LaborAchievementRepositoryMySQL();
exports.dependencies = {
    laborAchievementRepository: exports.laborAchievementRepository,
};
