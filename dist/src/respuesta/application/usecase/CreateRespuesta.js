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
exports.RegistrarRespuesta = void 0;
class RegistrarRespuesta {
    constructor(respuestaRepo) {
        this.respuestaRepo = respuestaRepo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.respuestaRepo.existsByEgresadoAndFormulario(data.id_egresado, data.id_formulario);
            if (exists) {
                throw new Error('El egresado ya respondió este formulario.');
            }
            const respuesta = yield this.respuestaRepo.create({
                id_egresado: data.id_egresado,
                id_formulario: data.id_formulario,
                respuestas_json: data.respuestas_json,
            });
            return respuesta;
        });
    }
}
exports.RegistrarRespuesta = RegistrarRespuesta;
