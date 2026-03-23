"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllEgresadosWithAchievementsController = void 0;
const authorization_1 = require("../../../../core/middleware/authorization");
const getAllEgresadosWithAchievementsController = (useCase) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const result = yield useCase.execute();
            const user = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
            if ((user === null || user === void 0 ? void 0 : user.rol) === 'director_programa_educativo') {
                const programIds = yield (0, authorization_1.getDirectorProgramIds)(user.id);
                const scoped = result.filter((item) => {
                    var _a;
                    const idPrograma = (_a = item === null || item === void 0 ? void 0 : item.egresado) === null || _a === void 0 ? void 0 : _a.id_programa_educativo;
                    return typeof idPrograma === 'number' && programIds.includes(idPrograma);
                });
                return res.status(200).json({
                    success: true,
                    data: scoped,
                    total: scoped.length
                });
            }
            return res.status(200).json({
                success: true,
                data: result,
                total: result.length
            });
        }
        catch (error) {
            next(error);
        }
    });
};
exports.getAllEgresadosWithAchievementsController = getAllEgresadosWithAchievementsController;
