import { PlatinumAPI, EgresadoExterno } from '../../infrastructure/external/PlatinumAPI';
import { EgresadoRepository, PeriodoRepository } from '../../domain/port/egresadoRepository';

export interface ActualizarPeriodosResult {
  status: 'completado' | 'parcial' | 'fallido';
  resumen: {
    egresados_procesados: number;
    actualizados: number;
    sin_periodo_externo: number;
    periodo_no_encontrado: number;
    errores: number;
  };
  errores?: string[];
}

export class ActualizarPeriodosEgresados {
  constructor(
    private platinumAPI: PlatinumAPI,
    private egresadoRepo: EgresadoRepository,
    private periodoRepo: PeriodoRepository,
    private batchSize: number = 100
  ) {}

  async execute(params?: any): Promise<ActualizarPeriodosResult> {
    console.log('🚀 Iniciando actualización de periodos de egresados...');
    
    const result: ActualizarPeriodosResult = {
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
      await this.syncPeriodosConIdExterno();
      console.log('✅ Periodos sincronizados');

      // Obtener egresados de Platinum
      console.log('📥 Obteniendo egresados de Platinum...');
      const egresadosExternos = await this.platinumAPI.getAlumnos(params);
      result.resumen.egresados_procesados = egresadosExternos.length;
      console.log(`📊 Total de egresados a procesar: ${egresadosExternos.length}`);

      // Procesar en lotes
      const batches = this.chunkArray(egresadosExternos, this.batchSize);
      let batchNum = 0;
      
      for (const batch of batches) {
        batchNum++;
        console.log(`⏳ Procesando lote ${batchNum}/${batches.length} (${batch.length} egresados)...`);
        
        const batchResult = await this.processBatch(batch);
        result.resumen.actualizados += batchResult.actualizados;
        result.resumen.sin_periodo_externo += batchResult.sin_periodo_externo;
        result.resumen.periodo_no_encontrado += batchResult.periodo_no_encontrado;
        result.resumen.errores += batchResult.errores;
        if (batchResult.erroresDetalles.length > 0) {
          result.errores?.push(...batchResult.erroresDetalles);
        }
        
        console.log(`   ✓ Lote ${batchNum}: ${batchResult.actualizados} actualizados`);
      }

      if (result.resumen.errores > 0 && result.resumen.actualizados === 0) {
        result.status = 'fallido';
      } else if (result.resumen.errores > 0) {
        result.status = 'parcial';
      }

      console.log('🏁 Actualización completada:');
      console.log(`   - Egresados procesados: ${result.resumen.egresados_procesados}`);
      console.log(`   - Actualizados: ${result.resumen.actualizados}`);
      console.log(`   - Sin periodo externo: ${result.resumen.sin_periodo_externo}`);
      console.log(`   - Periodo no encontrado: ${result.resumen.periodo_no_encontrado}`);
      console.log(`   - Errores: ${result.resumen.errores}`);

      return result;

    } catch (error) {
      const err = error as Error;
      console.error('❌ Error en actualización de periodos:', err.message);
      result.status = 'fallido';
      result.errores?.push(`Error general: ${err.message}`);
      return result;
    }
  }

  private async syncPeriodosConIdExterno(): Promise<void> {
    try {
      const periodosExternos = await this.platinumAPI.getPeriodos();
      
      for (const periodoExt of periodosExternos) {
        // Buscar por cohorte y actualizar periodo_id_externo si no lo tiene
        const existe = await this.periodoRepo.findByCohorte(periodoExt.Cohorte);
        if (existe && !existe.periodo_id_externo) {
          await this.periodoRepo.updatePeriodoIdExterno(periodoExt.Cohorte, periodoExt.periodo_id);
        }
      }
    } catch (error) {
      console.error('Error sincronizando periodos:', error);
    }
  }

  private async processBatch(egresadosExternos: EgresadoExterno[]): Promise<{
    actualizados: number;
    sin_periodo_externo: number;
    periodo_no_encontrado: number;
    errores: number;
    erroresDetalles: string[];
  }> {
    const batchResult = {
      actualizados: 0,
      sin_periodo_externo: 0,
      periodo_no_encontrado: 0,
      errores: 0,
      erroresDetalles: [] as string[]
    };

    for (const egresadoExt of egresadosExternos) {
      try {
        // Verificar que tenga UltimoPeriodoID
        if (!egresadoExt.UltimoPeriodoID) {
          batchResult.sin_periodo_externo++;
          continue;
        }

        // Buscar el periodo por periodo_id_externo
        const periodo = await this.periodoRepo.findByPeriodoIdExterno(egresadoExt.UltimoPeriodoID);
        
        if (!periodo) {
          batchResult.periodo_no_encontrado++;
          continue;
        }

        // Actualizar el egresado
        const actualizado = await (this.egresadoRepo as any).updatePeriodoByMatricula(
          egresadoExt.Matricula.trim(),
          periodo.id_periodo
        );

        if (actualizado) {
          batchResult.actualizados++;
        }

      } catch (error) {
        const err = error as Error;
        batchResult.errores++;
        batchResult.erroresDetalles.push(
          `Error actualizando egresado ${egresadoExt.Matricula}: ${err.message}`
        );
      }
    }

    return batchResult;
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
