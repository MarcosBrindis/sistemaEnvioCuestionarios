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
exports.GetOpcionPreguntasByQuestionId = exports.GetAllOpcionesPreguntas = exports.GetOpcionPreguntaById = void 0;
class GetOpcionPreguntaById {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findById(id);
        });
    }
}
exports.GetOpcionPreguntaById = GetOpcionPreguntaById;
class GetAllOpcionesPreguntas {
    constructor(repo) {
        this.repo = repo;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findAll();
        });
    }
}
exports.GetAllOpcionesPreguntas = GetAllOpcionesPreguntas;
class GetOpcionPreguntasByQuestionId {
    constructor(repo) {
        this.repo = repo;
    }
    execute(idPregunta) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.findByQuestionId(idPregunta);
        });
    }
}
exports.GetOpcionPreguntasByQuestionId = GetOpcionPreguntasByQuestionId;
