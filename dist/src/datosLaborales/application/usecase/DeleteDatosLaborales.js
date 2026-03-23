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
exports.DeleteDatosLaborales = void 0;
class DeleteDatosLaborales {
    constructor(repository) {
        this.repository = repository;
    }
    execute(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.repository.existsByEgresadoId(idEgresado);
            if (!exists) {
                throw new Error("No se encontraron datos laborales para este egresado.");
            }
            return yield this.repository.delete(idEgresado);
        });
    }
}
exports.DeleteDatosLaborales = DeleteDatosLaborales;
