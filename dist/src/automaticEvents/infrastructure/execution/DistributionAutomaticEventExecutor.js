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
exports.DistributionAutomaticEventExecutor = void 0;
class DistributionAutomaticEventExecutor {
    constructor(birthdayDispatchUseCase, surveyDispatchUseCase) {
        this.birthdayDispatchUseCase = birthdayDispatchUseCase;
        this.surveyDispatchUseCase = surveyDispatchUseCase;
    }
    execute(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.event_type === 'birthday_dispatch') {
                const payload = event.payload;
                const referenceDate = payload.reference_date ? new Date(payload.reference_date) : undefined;
                return this.birthdayDispatchUseCase.execute({
                    id_template: payload.id_template,
                    referenceDate
                });
            }
            const payload = event.payload;
            return this.surveyDispatchUseCase.execute({
                id_encuesta: payload.id_encuesta,
                id_template: payload.id_template,
                filtro: payload.filtro,
                id_group: payload.id_group
            });
        });
    }
}
exports.DistributionAutomaticEventExecutor = DistributionAutomaticEventExecutor;
