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
exports.GetUserPrograms = void 0;
class GetUserPrograms {
    constructor(repository) {
        this.repository = repository;
    }
    execute(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield this.repository.getUserPrograms(id_usuario);
                return {
                    success: true,
                    data: programs,
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Error desconocido',
                };
            }
        });
    }
}
exports.GetUserPrograms = GetUserPrograms;
