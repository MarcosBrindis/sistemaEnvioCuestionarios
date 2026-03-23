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
exports.UpdatePerfilCompletoAdmin = void 0;
class UpdatePerfilCompletoAdmin {
    constructor(egresadoRepository) {
        this.egresadoRepository = egresadoRepository;
    }
    execute(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const egresado = yield this.egresadoRepository.findById(dto.id);
            if (!egresado) {
                throw new Error('Egresado no encontrado');
            }
            const updateData = {};
            if (dto.nombre !== undefined) {
                if (typeof dto.nombre !== 'string' || dto.nombre.trim().length === 0) {
                    throw new Error('Nombre inválido');
                }
                updateData.nombre = dto.nombre.trim();
            }
            if (dto.primer_apellido !== undefined) {
                if (typeof dto.primer_apellido !== 'string' || dto.primer_apellido.trim().length === 0) {
                    throw new Error('Primer apellido inválido');
                }
                updateData.primer_apellido = dto.primer_apellido.trim();
            }
            if (dto.segundo_apellido !== undefined) {
                updateData.segundo_apellido = dto.segundo_apellido ? dto.segundo_apellido.trim() : null;
            }
            if (dto.email !== undefined) {
                if (typeof dto.email === 'string' && dto.email.length > 0) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(dto.email)) {
                        throw new Error('Email inválido');
                    }
                    updateData.email = dto.email;
                }
            }
            if (dto.fecha_nacimiento !== undefined) {
                if (typeof dto.fecha_nacimiento === 'string' && dto.fecha_nacimiento.length > 0) {
                    const fecha = new Date(dto.fecha_nacimiento);
                    if (isNaN(fecha.getTime())) {
                        throw new Error('Fecha de nacimiento inválida');
                    }
                    updateData.fecha_nacimiento = dto.fecha_nacimiento;
                }
            }
            if (dto.imagen_egresado !== undefined) {
                if (typeof dto.imagen_egresado === 'string' && dto.imagen_egresado.length > 0) {
                    if (dto.imagen_egresado.length > 4294967295) {
                        throw new Error('La URL de la imagen es demasiado larga');
                    }
                    updateData.imagen_egresado = dto.imagen_egresado;
                }
            }
            if (dto.id_programa_educativo !== undefined) {
                if (typeof dto.id_programa_educativo === 'number' && dto.id_programa_educativo > 0) {
                    updateData.id_programa_educativo = dto.id_programa_educativo;
                }
            }
            if (dto.id_periodo !== undefined) {
                if (typeof dto.id_periodo === 'number' && dto.id_periodo > 0) {
                    updateData.id_periodo = dto.id_periodo;
                }
            }
            if (dto.id_estado !== undefined) {
                if (![1, 2, 3].includes(dto.id_estado)) {
                    throw new Error('Estado de egresado inválido');
                }
                updateData.id_estado = dto.id_estado;
            }
            if (Object.keys(updateData).length === 0) {
                throw new Error('No se proporcionaron campos válidos para actualizar');
            }
            const egresadoActualizado = yield this.egresadoRepository.updatePerfilCompleto(dto.id, updateData);
            return egresadoActualizado;
        });
    }
}
exports.UpdatePerfilCompletoAdmin = UpdatePerfilCompletoAdmin;
