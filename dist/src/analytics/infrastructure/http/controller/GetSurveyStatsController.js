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
exports.GetSurveyStatsController = void 0;
class GetSurveyStatsController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    run(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id_encuesta);
                if (isNaN(id))
                    return res.status(400).json({ error: 'ID inválido' });
                const data = yield this.useCase.execute(id);
                res.status(200).json({ data });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.GetSurveyStatsController = GetSurveyStatsController;
