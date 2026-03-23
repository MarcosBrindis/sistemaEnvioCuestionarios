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
exports.assignSurveyGroupController = void 0;
// import { errorHandler } from '../../../../core/middleware/errorHandler';
const assignSurveyGroupController = (assignSurveyGroup) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idEncuesta = Number(req.params.id);
        const { data } = req.body;
        if (!data || !data.attributes || !data.attributes.id_group) {
            return res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Debes enviar id_group en attributes' } });
        }
        const idGroup = Number(data.attributes.id_group);
        const result = yield assignSurveyGroup.execute(idEncuesta, idGroup);
        res.status(200).json({ meta: result });
    }
    catch (error) {
        next(error);
    }
});
exports.assignSurveyGroupController = assignSurveyGroupController;
