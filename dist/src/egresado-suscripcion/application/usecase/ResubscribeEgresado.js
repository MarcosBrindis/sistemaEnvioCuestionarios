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
exports.ResubscribeEgresado = void 0;
class ResubscribeEgresado {
    constructor(egresadoRepo, bajaCorreoRepo) {
        this.egresadoRepo = egresadoRepo;
        this.bajaCorreoRepo = bajaCorreoRepo;
    }
    execute(id_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Reactivar egresado
            yield this.egresadoRepo.setActivo(id_egresado, true);
            // 2. Eliminar registro de baja
            yield this.bajaCorreoRepo.eliminarBaja(id_egresado);
            return {
                is_active: true,
                estado_actual: 'activo',
            };
        });
    }
}
exports.ResubscribeEgresado = ResubscribeEgresado;
