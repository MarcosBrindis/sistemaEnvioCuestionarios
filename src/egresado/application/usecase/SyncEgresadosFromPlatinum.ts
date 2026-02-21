function isValidDate(dateStr: string | null | undefined): boolean {
  if (!dateStr) return false;
  if (/^0000|\-00\-|\-00$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}
import { PlatinumAPI, PeriodoParser, EgresadoExterno } from '../../infrastructure/external/PlatinumAPI';
import { EgresadoRepository, PeriodoRepository, ProgramaEducativoRepository } from '../../domain/port/egresadoRepository';
import { Egresado } from '../../domain/model/egresado';

export interface SyncResult {
  status: 'completado' | 'parcial' | 'fallido';
  resumen: {
    periodos_nuevos: number;
    programas_nuevos: number;
    egresados_procesados_total: number;
    nuevos_insertados: number;
    existentes_ignorados: number;
    errores: number;
  };
  errores?: string[];
}

export class SyncEgresadosFromPlatinum {
  constructor(
    private platinumAPI: PlatinumAPI,
    private egresadoRepo: EgresadoRepository,
    private periodoRepo: PeriodoRepository,
    private programaRepo: ProgramaEducativoRepository,
    private batchSize: number = 50
  ) {}

  async execute(params?: any): Promise<SyncResult> {
    console.log('🚀 Iniciando sincronización de egresados desde Platinum...');
    
    const result: SyncResult = {
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
      console.log('📅 Sincronizando periodos...');
      const periodosSync = await this.syncPeriodos();
      result.resumen.periodos_nuevos = periodosSync;
      console.log(`✅ Periodos sincronizados: ${periodosSync} nuevos`);

      console.log('🎓 Sincronizando programas educativos...');
      const programasSync = await this.syncProgramasEducativos();
      result.resumen.programas_nuevos = programasSync;
      console.log(`✅ Programas sincronizados: ${programasSync} nuevos`);

      console.log('📥 Obteniendo egresados de Platinum...');
      const alumnos = await this.platinumAPI.getAlumnos(params);
      result.resumen.egresados_procesados_total = alumnos.length;
      console.log(`📊 Total de egresados a procesar: ${alumnos.length}`);

      const batches = this.chunkArray(alumnos, this.batchSize);
      
      for (let i = 0; i < batches.length; i++) {
        console.log(`⏳ Procesando lote ${i + 1}/${batches.length}...`);
        const batchResult = await this.processEgresadosBatch(batches[i]);
        
        result.resumen.nuevos_insertados += batchResult.insertados;
        result.resumen.existentes_ignorados += batchResult.ignorados;
        result.resumen.errores += batchResult.errores;
        
        if (batchResult.erroresDetalles.length > 0) {
          result.errores?.push(...batchResult.erroresDetalles);
        }
        
        console.log(`   ✓ Lote ${i + 1}: ${batchResult.insertados} insertados, ${batchResult.ignorados} existentes`);
      }

      if (result.resumen.errores > 0 && result.resumen.nuevos_insertados === 0) {
        result.status = 'fallido';
      } else if (result.resumen.errores > 0) {
        result.status = 'parcial';
      }

      console.log('🏁 Sincronización completada:');
      console.log(`   - Periodos nuevos: ${result.resumen.periodos_nuevos}`);
      console.log(`   - Programas nuevos: ${result.resumen.programas_nuevos}`);
      console.log(`   - Egresados procesados: ${result.resumen.egresados_procesados_total}`);
      console.log(`   - Nuevos insertados: ${result.resumen.nuevos_insertados}`);
      console.log(`   - Existentes ignorados: ${result.resumen.existentes_ignorados}`);
      console.log(`   - Errores: ${result.resumen.errores}`);

      return result;

    } catch (error) {
      const err = error as Error;
      console.error('❌ Error en sincronización:', err.message);
      result.status = 'fallido';
      result.errores?.push(`Error general: ${err.message}`);
      return result;
    }
  }

  private async syncPeriodos(): Promise<number> {
    let nuevos = 0;
    try {
      const periodosExternos = await this.platinumAPI.getPeriodos();
      
      for (const periodoExt of periodosExternos) {
        // Primero intentar buscar por periodo_id_externo
        let existe = await this.periodoRepo.findByPeriodoIdExterno(periodoExt.periodo_id);
        
        // Si no existe por periodo_id_externo, buscar por cohorte
        if (!existe) {
          existe = await this.periodoRepo.findByCohorte(periodoExt.Cohorte);
        }
        
        if (existe) {
          // Si existe pero no tiene periodo_id_externo, actualizarlo
          if (!existe.periodo_id_externo) {
            await this.periodoRepo.updatePeriodoIdExterno(periodoExt.Cohorte, periodoExt.periodo_id);
          }
          continue;
        }

        const fechas = PeriodoParser.parsePeriodoToDates(periodoExt.label);
        if (!fechas) {
          continue;
        }

        await this.periodoRepo.create({
          fecha_inicio: PeriodoParser.formatDateForDB(fechas.fecha_inicio),
          fecha_fin: PeriodoParser.formatDateForDB(fechas.fecha_fin),
          cohorte: periodoExt.Cohorte,
          periodo_id_externo: periodoExt.periodo_id
        });
        nuevos++;
      }
    } catch (error) {    }
    return nuevos;
  }

  private async syncProgramasEducativos(): Promise<number> {
    let nuevos = 0;
    try {
      const carrerasExternas = await this.platinumAPI.getCarreras();
      
      for (const carreraExt of carrerasExternas) {
        const existe = await this.programaRepo.findByIdOrNombre(
          carreraExt.carrera_id, 
          carreraExt.label
        );
        if (existe) continue;

        await this.programaRepo.create({
          nombre: carreraExt.label
        });
        nuevos++;
      }
    } catch (error) {
    }
    return nuevos;
  }

  private async processEgresadosBatch(
    egresadosExternos: EgresadoExterno[]
  ): Promise<{ insertados: number; ignorados: number; errores: number; erroresDetalles: string[] }> {
    const batchResult = {
      insertados: 0,
      ignorados: 0,
      errores: 0,
      erroresDetalles: [] as string[]
    };

    const nuevosEgresados: Omit<Egresado, 'id_egresado'>[] = [];

    for (const egresadoExt of egresadosExternos) {
      try {
        const existe = await this.egresadoRepo.existsByMatricula(egresadoExt.Matricula);
        if (existe) {
          batchResult.ignorados++;
          continue;
        }

        const programa = await this.programaRepo.findByIdOrNombre(
          egresadoExt.carrera_id,
          egresadoExt.Carrera
        );
        if (!programa) {
          batchResult.errores++;
          batchResult.erroresDetalles.push(
            `Programa no encontrado para egresado ${egresadoExt.Matricula}: ${egresadoExt.Carrera}`
          );
          continue;
        }

        const periodo = await this.periodoRepo.findByPeriodoIdExterno(egresadoExt.UltimoPeriodoID);
        
        const egresadoLocal: Omit<Egresado, 'id_egresado'> = {
          nombre: egresadoExt.Nombre.trim(),
          primer_apellido: egresadoExt.apaterno.trim(),
          segundo_apellido: egresadoExt.amaterno?.trim() || null,
          matricula: egresadoExt.Matricula.trim(),
          curp: egresadoExt.CURP.trim(),
          email: egresadoExt.CorreoElectronico?.trim() || null,
          imagen_egresado: null,
          sinopsis: null,
          fecha_nacimiento: isValidDate(egresadoExt.FechaNacimiento) ? egresadoExt.FechaNacimiento : null,
          is_active: true,
          id_estado: 1, // Pendiente por defecto
          id_programa_educativo: (programa as any).id_programa_educativo,
          id_periodo: periodo ? (periodo as any).id_periodo : null
        };

        nuevosEgresados.push(egresadoLocal);
      } catch (error) {
        const err = error as Error;
        batchResult.errores++;
        batchResult.erroresDetalles.push(
          `Error procesando egresado ${egresadoExt.Matricula}: ${err.message}`
        );
      }
    }

    if (nuevosEgresados.length > 0) {
      try {
        const insertados = await this.egresadoRepo.batchCreate(nuevosEgresados);
        batchResult.insertados = insertados;
      } catch (error) {
        const err = error as Error;
        batchResult.errores += nuevosEgresados.length;
        batchResult.erroresDetalles.push(`Error en batch insert: ${err.message}`);
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
