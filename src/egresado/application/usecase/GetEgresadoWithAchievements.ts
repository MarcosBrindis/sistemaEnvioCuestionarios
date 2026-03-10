import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { ProgramaEducativoRepository } from '../../domain/port/egresadoRepository';

export class GetEgresadoWithAchievements {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private programaRepo: ProgramaEducativoRepository
  ) {}

  async execute(idEgresado: number) {
    const egresado = await this.egresadoRepo.findById(idEgresado);
    
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    const programaEducativo = egresado.id_programa_educativo
      ? await this.programaRepo.findByIdOrNombre(String(egresado.id_programa_educativo))
      : null;

    return {
      egresado: {
        id: egresado.id_egresado,
        nombre: egresado.nombre,
        primer_apellido: egresado.primer_apellido,
        segundo_apellido: egresado.segundo_apellido,
        matricula: egresado.matricula,
        curp: egresado.curp,
        email: egresado.email,
        imagen_egresado: egresado.imagen_egresado,
        sinopsis: egresado.sinopsis,
        fecha_nacimiento: egresado.fecha_nacimiento,
        is_active: egresado.is_active,
        id_estado: egresado.id_estado,
        id_programa_educativo: egresado.id_programa_educativo,
        programa_educativo: programaEducativo?.nombre ?? null,
        id_periodo: egresado.id_periodo
      }
    };
  }
}
