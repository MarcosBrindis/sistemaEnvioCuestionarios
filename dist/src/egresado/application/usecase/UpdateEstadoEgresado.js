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
exports.UpdateEstadoEgresado = void 0;
class UpdateEstadoEgresado {
    constructor(egresadoRepository) {
        this.egresadoRepository = egresadoRepository;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el egresado existe
            const egresado = yield this.egresadoRepository.findById(dto.id);
            if (!egresado) {
                throw new Error('Egresado no encontrado');
            }
            if (![1, 2, 3].includes(dto.id_estado)) {
                throw new Error('Estado de egresado inválido. Los valores válidos son: 1 (pendiente), 2 (rechazado), 3 (aprobado)');
            }
            const egresadoActualizado = yield this.egresadoRepository.updateEstado(dto.id, dto.id_estado);
            return egresadoActualizado;
        });
    }
}
exports.UpdateEstadoEgresado = UpdateEstadoEgresado;
