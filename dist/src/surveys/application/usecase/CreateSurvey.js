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
exports.CreateSurvey = void 0;
class CreateSurvey {
    constructor(repository) {
        this.repository = repository;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.name || !data.formId || !data.templateId) {
                throw new Error('Name, formId, and templateId are required');
            }
            const exists = yield this.repository.existsActiveByName(data.name);
            if (exists) {
                throw new Error('An active survey with this name already exists');
            }
            return this.repository.create(data);
        });
    }
}
exports.CreateSurvey = CreateSurvey;
