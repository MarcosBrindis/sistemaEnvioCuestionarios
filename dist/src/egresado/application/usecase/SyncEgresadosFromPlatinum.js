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
exports.SyncEgresadosFromPlatinum = void 0;
function isValidDate(dateStr) {
    if (!dateStr)
        return false;
    if (/^0000|\-00\-|\-00$/.test(dateStr))
        return false;
    const d = new Date(dateStr);
    return !isNaN(d.getTime());
}
const PlatinumAPI_1 = require("../../infrastructure/external/PlatinumAPI");
class SyncEgresadosFromPlatinum {
    constructor(platinumAPI, egresadoRepo, periodoRepo, programaRepo, batchSize = 50) {
        this.platinumAPI = platinumAPI;
        this.egresadoRepo = egresadoRepo;
        this.periodoRepo = periodoRepo;
        this.programaRepo = programaRepo;
        this.batchSize = batchSize;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log('🚀 Iniciando sincronización de egresados desde Platinum...');
            const result = {
                status: 'completado',
                resumen: {
                    periodos_nuevos: 0,
                    programas_nuevos: 0,
                    egresados_procesados_total: 0,
                    nuevos_insertados: 0,
                    existentes_ignorados: 0,
                    errores: 0
                },
                errores: []
            };
            try {
                console.log('Sincronizando periodos...');
                const periodosSync = yield this.syncPeriodos();
                result.resumen.periodos_nuevos = periodosSync;
                console.log(`Periodos sincronizados: ${periodosSync} nuevos`);
                console.log('Sincronizando programas educativos...');
                const programasSync = yield this.syncProgramasEducativos();
                result.resumen.programas_nuevos = programasSync;
                console.log(`Programas sincronizados: ${programasSync} nuevos`);
                console.log('Obteniendo egresados de Platinum...');
                const alumnos = yield this.platinumAPI.getAlumnos(params);
                result.resumen.egresados_procesados_total = alumnos.length;
                console.log(`Total de egresados a procesar: ${alumnos.length}`);
                const batches = this.chunkArray(alumnos, this.batchSize);
                for (let i = 0; i < batches.length; i++) {
                    console.log(`Procesando lote ${i + 1}/${batches.length}...`);
                    const batchResult = yield this.processEgresadosBatch(batches[i]);
                    result.resumen.nuevos_insertados += batchResult.insertados;
                    result.resumen.existentes_ignorados += batchResult.ignorados;
                    result.resumen.errores += batchResult.errores;
                    if (batchResult.erroresDetalles.length > 0) {
                        (_a = result.errores) === null || _a === void 0 ? void 0 : _a.push(...batchResult.erroresDetalles);
                    }
                    console.log(`Lote ${i + 1}: ${batchResult.insertados} insertados, ${batchResult.ignorados} existentes`);
                }
                if (result.resumen.errores > 0 && result.resumen.nuevos_insertados === 0) {
                    result.status = 'fallido';
                }
                else if (result.resumen.errores > 0) {
                    result.status = 'parcial';
                }
                console.log('Sincronización completada:');
                console.log(`- Periodos nuevos: ${result.resumen.periodos_nuevos}`);
                console.log(`- Programas nuevos: ${result.resumen.programas_nuevos}`);
                console.log(`- Egresados procesados: ${result.resumen.egresados_procesados_total}`);
                console.log(`- Nuevos insertados: ${result.resumen.nuevos_insertados}`);
                console.log(`- Existentes ignorados: ${result.resumen.existentes_ignorados}`);
                console.log(`- Errores: ${result.resumen.errores}`);
                return result;
            }
            catch (error) {
                const err = error;
                console.error('Error en sincronización:', err.message);
                result.status = 'fallido';
                (_b = result.errores) === null || _b === void 0 ? void 0 : _b.push(`Error general: ${err.message}`);
                return result;
            }
        });
    }
    syncPeriodos() {
        return __awaiter(this, void 0, void 0, function* () {
            let nuevos = 0;
            try {
                const periodosExternos = yield this.platinumAPI.getPeriodos();
                for (const periodoExt of periodosExternos) {
                    // Primero intentar buscar por periodo_id_externo
                    let existe = yield this.periodoRepo.findByPeriodoIdExterno(periodoExt.periodo_id);
                    // Si no existe por periodo_id_externo, buscar por cohorte
                    if (!existe) {
                        existe = yield this.periodoRepo.findByCohorte(periodoExt.Cohorte);
                    }
                    if (existe) {
                        // Si existe pero no tiene periodo_id_externo, actualizarlo
                        if (!existe.periodo_id_externo) {
                            yield this.periodoRepo.updatePeriodoIdExterno(periodoExt.Cohorte, periodoExt.periodo_id);
                        }
                        continue;
                    }
                    const fechas = PlatinumAPI_1.PeriodoParser.parsePeriodoToDates(periodoExt.label);
                    if (!fechas) {
                        continue;
                    }
                    yield this.periodoRepo.create({
                        fecha_inicio: PlatinumAPI_1.PeriodoParser.formatDateForDB(fechas.fecha_inicio),
                        fecha_fin: PlatinumAPI_1.PeriodoParser.formatDateForDB(fechas.fecha_fin),
                        cohorte: periodoExt.Cohorte,
                        periodo_id_externo: periodoExt.periodo_id
                    });
                    nuevos++;
                }
            }
            catch (error) { }
            return nuevos;
        });
    }
    syncProgramasEducativos() {
        return __awaiter(this, void 0, void 0, function* () {
            let nuevos = 0;
            try {
                const carrerasExternas = yield this.platinumAPI.getCarreras();
                for (const carreraExt of carrerasExternas) {
                    const existe = yield this.programaRepo.findByIdOrNombre(carreraExt.carrera_id, carreraExt.label);
                    if (existe)
                        continue;
                    yield this.programaRepo.create({
                        nombre: carreraExt.label
                    });
                    nuevos++;
                }
            }
            catch (error) {
            }
            return nuevos;
        });
    }
    processEgresadosBatch(egresadosExternos) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const batchResult = {
                insertados: 0,
                ignorados: 0,
                errores: 0,
                erroresDetalles: []
            };
            const nuevosEgresados = [];
            for (const egresadoExt of egresadosExternos) {
                try {
                    const existe = yield this.egresadoRepo.existsByMatricula(egresadoExt.Matricula);
                    if (existe) {
                        batchResult.ignorados++;
                        continue;
                    }
                    const programa = yield this.programaRepo.findByIdOrNombre(egresadoExt.carrera_id, egresadoExt.Carrera);
                    if (!programa) {
                        batchResult.errores++;
                        batchResult.erroresDetalles.push(`Programa no encontrado para egresado ${egresadoExt.Matricula}: ${egresadoExt.Carrera}`);
                        continue;
                    }
                    const periodo = yield this.periodoRepo.findByPeriodoIdExterno(egresadoExt.UltimoPeriodoID);
                    const egresadoLocal = {
                        nombre: egresadoExt.Nombre.trim(),
                        primer_apellido: egresadoExt.apaterno.trim(),
                        segundo_apellido: ((_a = egresadoExt.amaterno) === null || _a === void 0 ? void 0 : _a.trim()) || null,
                        matricula: egresadoExt.Matricula.trim(),
                        curp: egresadoExt.CURP.trim(),
                        email: ((_b = egresadoExt.CorreoElectronico) === null || _b === void 0 ? void 0 : _b.trim()) || null,
                        imagen_egresado: null,
                        sinopsis: null,
                        fecha_nacimiento: isValidDate(egresadoExt.FechaNacimiento) ? egresadoExt.FechaNacimiento : null,
                        is_active: true,
                        id_estado: 1, // Pendiente por defecto
                        id_programa_educativo: programa.id_programa_educativo,
                        id_periodo: periodo ? periodo.id_periodo : null
                    };
                    nuevosEgresados.push(egresadoLocal);
                }
                catch (error) {
                    const err = error;
                    batchResult.errores++;
                    batchResult.erroresDetalles.push(`Error procesando egresado ${egresadoExt.Matricula}: ${err.message}`);
                }
            }
            if (nuevosEgresados.length > 0) {
                try {
                    const insertados = yield this.egresadoRepo.batchCreate(nuevosEgresados);
                    batchResult.insertados = insertados;
                }
                catch (error) {
                    const err = error;
                    batchResult.errores += nuevosEgresados.length;
                    batchResult.erroresDetalles.push(`Error en batch insert: ${err.message}`);
                }
            }
            return batchResult;
        });
    }
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
exports.SyncEgresadosFromPlatinum = SyncEgresadosFromPlatinum;
