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
exports.deleteSurveyController = void 0;
const errorHandler_1 = require("../../../../core/middleware/errorHandler");
const deleteSurveyController = (deleteSurvey) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield deleteSurvey.execute(id);
        if (result === 'deleted') {
            res.status(204).send();
        }
        else {
            res.status(200).json({ meta: { deactivated: true } });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleDeleteError)(error, req, res, next);
    }
});
exports.deleteSurveyController = deleteSurveyController;
