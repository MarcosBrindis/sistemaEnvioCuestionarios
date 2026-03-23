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
exports.GetQuestionWithOptionsById = exports.GetQuestionsWithOptions = exports.SearchQuestionsByText = exports.GetQuestionsByTypeId = exports.GetAllQuestions = exports.GetQuestionById = void 0;
class GetQuestionById {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findById(id);
        });
    }
}
exports.GetQuestionById = GetQuestionById;
class GetAllQuestions {
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findAll();
        });
    }
}
exports.GetAllQuestions = GetAllQuestions;
class GetQuestionsByTypeId {
    constructor(repo) {
        this.repo = repo;
    }
    execute(idTipoPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findByTypeQuestionId(idTipoPregunta);
        });
    }
}
exports.GetQuestionsByTypeId = GetQuestionsByTypeId;
class SearchQuestionsByText {
    constructor(repo) {
        this.repo = repo;
    }
    execute(texto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!texto || texto.trim() === '') {
                throw new Error('El parámetro de búsqueda no puede estar vacío');
            }
            return yield this.repo.searchByText(texto.trim());
        });
    }
}
exports.SearchQuestionsByText = SearchQuestionsByText;
class GetQuestionsWithOptions {
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getAllQuestionsWithOptions();
        });
    }
}
exports.GetQuestionsWithOptions = GetQuestionsWithOptions;
class GetQuestionWithOptionsById {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getQuestionWithOptions(id);
        });
    }
}
exports.GetQuestionWithOptionsById = GetQuestionWithOptionsById;
