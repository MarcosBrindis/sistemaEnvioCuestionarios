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
exports.ActualizarPeriodosEgresados = void 0;
class ActualizarPeriodosEgresados {
    constructor(platinumAPI, egresadoRepo, periodoRepo, batchSize = 100) {
        this.platinumAPI = platinumAPI;
        this.egresadoRepo = egresadoRepo;
        this.periodoRepo = periodoRepo;
        this.batchSize = batchSize;
    }
    execute(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            console.log('🚀 Iniciando actualización de periodos de egresados...');
            const result = {
                status: 'completado',
                resumen: {
                    egresados_procesados: 0,
                    actualizados: 0,
                    sin_periodo_externo: 0,
                    periodo_no_encontrado: 0,
                    errores: 0
                },
                errores: []
            };
            try {
                // Primero sincronizar periodos para asegurar que tengan periodo_id_externo
                console.log('📅 Sincronizando periodos con periodo_id_externo...');
                yield this.syncPeriodosConIdExterno();
                console.log('✅ Periodos sincronizados');
                // Obtener egresados de Platinum
                console.log('📥 Obteniendo egresados de Platinum...');
                const egresadosExternos = yield this.platinumAPI.getAlumnos(params);
                result.resumen.egresados_procesados = egresadosExternos.length;
                console.log(`📊 Total de egresados a procesar: ${egresadosExternos.length}`);
                // Procesar en lotes
                const batches = this.chunkArray(egresadosExternos, this.batchSize);
                let batchNum = 0;
                for (const batch of batches) {
                    batchNum++;
                    console.log(`⏳ Procesando lote ${batchNum}/${batches.length} (${batch.length} egresados)...`);
                    const batchResult = yield this.processBatch(batch);
                    result.resumen.actualizados += batchResult.actualizados;
                    result.resumen.sin_periodo_externo += batchResult.sin_periodo_externo;
                    result.resumen.periodo_no_encontrado += batchResult.periodo_no_encontrado;
                    result.resumen.errores += batchResult.errores;
                    if (batchResult.erroresDetalles.length > 0) {
                        (_a = result.errores) === null || _a === void 0 ? void 0 : _a.push(...batchResult.erroresDetalles);
                    }
                    console.log(`   ✓ Lote ${batchNum}: ${batchResult.actualizados} actualizados`);
                }
                if (result.resumen.errores > 0 && result.resumen.actualizados === 0) {
                    result.status = 'fallido';
                }
                else if (result.resumen.errores > 0) {
                    result.status = 'parcial';
                }
                console.log('🏁 Actualización completada:');
                console.log(`   - Egresados procesados: ${result.resumen.egresados_procesados}`);
                console.log(`   - Actualizados: ${result.resumen.actualizados}`);
                console.log(`   - Sin periodo externo: ${result.resumen.sin_periodo_externo}`);
                console.log(`   - Periodo no encontrado: ${result.resumen.periodo_no_encontrado}`);
                console.log(`   - Errores: ${result.resumen.errores}`);
                return result;
            }
            catch (error) {
                const err = error;
                console.error('❌ Error en actualización de periodos:', err.message);
                result.status = 'fallido';
                (_b = result.errores) === null || _b === void 0 ? void 0 : _b.push(`Error general: ${err.message}`);
                return result;
            }
        });
    }
    syncPeriodosConIdExterno() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const periodosExternos = yield this.platinumAPI.getPeriodos();
                for (const periodoExt of periodosExternos) {
                    // Buscar por cohorte y actualizar periodo_id_externo si no lo tiene
                    const existe = yield this.periodoRepo.findByCohorte(periodoExt.Cohorte);
                    if (existe && !existe.periodo_id_externo) {
                        yield this.periodoRepo.updatePeriodoIdExterno(periodoExt.Cohorte, periodoExt.periodo_id);
                    }
                }
            }
            catch (error) {
                console.error('Error sincronizando periodos:', error);
            }
        });
    }
    processBatch(egresadosExternos) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchResult = {
                actualizados: 0,
                sin_periodo_externo: 0,
                periodo_no_encontrado: 0,
                errores: 0,
                erroresDetalles: []
            };
            for (const egresadoExt of egresadosExternos) {
                try {
                    // Verificar que tenga UltimoPeriodoID
                    if (!egresadoExt.UltimoPeriodoID) {
                        batchResult.sin_periodo_externo++;
                        continue;
                    }
                    // Buscar el periodo por periodo_id_externo
                    const periodo = yield this.periodoRepo.findByPeriodoIdExterno(egresadoExt.UltimoPeriodoID);
                    if (!periodo) {
                        batchResult.periodo_no_encontrado++;
                        continue;
                    }
                    // Actualizar el egresado
                    const actualizado = yield this.egresadoRepo.updatePeriodoByMatricula(egresadoExt.Matricula.trim(), periodo.id_periodo);
                    if (actualizado) {
                        batchResult.actualizados++;
                    }
                }
                catch (error) {
                    const err = error;
                    batchResult.errores++;
                    batchResult.erroresDetalles.push(`Error actualizando egresado ${egresadoExt.Matricula}: ${err.message}`);
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
exports.ActualizarPeriodosEgresados = ActualizarPeriodosEgresados;
