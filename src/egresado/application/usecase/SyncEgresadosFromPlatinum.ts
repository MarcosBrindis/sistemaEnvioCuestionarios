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
      const periodosSync = await this.syncPeriodos();
      result.resumen.periodos_nuevos = periodosSync;

      const programasSync = await this.syncProgramasEducativos();
      result.resumen.programas_nuevos = programasSync;

      const alumnos = await this.platinumAPI.getAlumnos(params);
      result.resumen.egresados_procesados_total = alumnos.length;

      const batches = this.chunkArray(alumnos, this.batchSize);
      
      for (let i = 0; i < batches.length; i++) {
        const batchResult = await this.processEgresadosBatch(batches[i]);
        
        result.resumen.nuevos_insertados += batchResult.insertados;
        result.resumen.existentes_ignorados += batchResult.ignorados;
        result.resumen.errores += batchResult.errores;
        
        if (batchResult.erroresDetalles.length > 0) {
          result.errores?.push(...batchResult.erroresDetalles);
        }
      }

      if (result.resumen.errores > 0 && result.resumen.nuevos_insertados === 0) {
        result.status = 'fallido';
      } else if (result.resumen.errores > 0) {
        result.status = 'parcial';
      }

      return result;

    } catch (error) {
      const err = error as Error;
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
        const existe = await this.periodoRepo.findByCohorte(periodoExt.Cohorte);
        if (existe) continue;

        const fechas = PeriodoParser.parsePeriodoToDates(periodoExt.label);
        if (!fechas) {
          continue;
        }

        await this.periodoRepo.create({
          fecha_inicio: PeriodoParser.formatDateForDB(fechas.fecha_inicio),
          fecha_fin: PeriodoParser.formatDateForDB(fechas.fecha_fin),
          cohorte: periodoExt.Cohorte
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

        const periodo = await this.periodoRepo.findByCohorte(egresadoExt.UltimoPeriodoID);
        
        const egresadoLocal: Omit<Egresado, 'id_egresado'> = {
          nombre: egresadoExt.Nombre.trim(),
          primer_apellido: egresadoExt.apaterno.trim(),
          segundo_apellido: egresadoExt.amaterno?.trim() || null,
          matricula: egresadoExt.Matricula.trim(),
          curp: egresadoExt.CURP.trim(),
          email: egresadoExt.CorreoElectronico?.trim() || null,
          imagen_egresado: null,
          fecha_nacimiento: isValidDate(egresadoExt.FechaNacimiento) ? egresadoExt.FechaNacimiento : null,
          is_active: true,
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
