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
exports.UpdateEgresadoSinopsis = void 0;
class UpdateEgresadoSinopsis {
    constructor(egresadoRepo) {
        this.egresadoRepo = egresadoRepo;
    }
    execute(idEgresado, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const egresado = yield this.egresadoRepo.findById(idEgresado);
            if (!egresado) {
                throw new Error('Egresado no encontrado');
            }
            if (data.sinopsis !== undefined && data.sinopsis !== null) {
                if (typeof data.sinopsis !== 'string' || data.sinopsis.trim() === '') {
                    throw new Error('Sinopsis no puede estar vacía');
                }
            }
            const actualizado = yield this.egresadoRepo.updatePerfilCompleto(idEgresado, {
                sinopsis: data.sinopsis,
            });
            return actualizado;
        });
    }
}
exports.UpdateEgresadoSinopsis = UpdateEgresadoSinopsis;
