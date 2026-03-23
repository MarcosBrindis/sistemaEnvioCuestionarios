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
exports.UpdateEgresadoPerfil = void 0;
class UpdateEgresadoPerfil {
    constructor(egresadoRepository) {
        this.egresadoRepository = egresadoRepository;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (dto.id !== dto.sessionEgresadoId) {
                throw new Error('No autorizado para editar este perfil');
            }
            const updateData = {};
            if (dto.email !== undefined) {
                updateData.email = dto.email;
            }
            if (dto.fecha_nacimiento !== undefined) {
                updateData.fecha_nacimiento = dto.fecha_nacimiento;
            }
            if (dto.imagen_egresado !== undefined) {
                if (typeof dto.imagen_egresado !== 'string') {
                    throw new Error('La imagen debe ser una URL válida');
                }
                if (dto.imagen_egresado.length > 4294967295) {
                    throw new Error('La URL de la imagen es demasiado larga');
                }
                updateData.imagen_egresado = dto.imagen_egresado;
            }
            const egresadoActualizado = yield this.egresadoRepository.updatePerfil(dto.id, updateData);
            return egresadoActualizado;
        });
    }
}
exports.UpdateEgresadoPerfil = UpdateEgresadoPerfil;
