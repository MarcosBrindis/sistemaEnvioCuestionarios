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
exports.UnsubscribeEgresado = void 0;
class UnsubscribeEgresado {
    constructor(egresadoRepo, bajaCorreoRepo) {
        this.egresadoRepo = egresadoRepo;
        this.bajaCorreoRepo = bajaCorreoRepo;
    }
    execute(id_egresado, motivo) {
        return __awaiter(this, void 0, void 0, function* () {
            // Transacción lógica: registrar baja y desactivar egresado
            // 1. Registrar baja
            yield this.bajaCorreoRepo.registrarBaja(id_egresado, motivo);
            // 2. Desactivar egresado
            yield this.egresadoRepo.setActivo(id_egresado, false);
            return {
                is_active: false,
                estado_actual: 'baja',
            };
        });
    }
}
exports.UnsubscribeEgresado = UnsubscribeEgresado;
