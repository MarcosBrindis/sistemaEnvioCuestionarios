import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { ProgramaEducativoRepository } from '../../domain/port/egresadoRepository';

export class GetAllEgresadosWithAchievements {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private programaRepo: ProgramaEducativoRepository
  ) {}

  async execute() {
    const [egresados, programasEducativos] = await Promise.all([
      this.egresadoRepo.findAll(),
      this.programaRepo.findAll()
    ]);

    const programaEducativoById = new Map<number, string>(
      programasEducativos.map((programa) => [programa.id_programa_educativo, programa.nombre])
    );

    const egresadosConPerfil = egresados.map((egresado) => {
      if (egresado.id_egresado === undefined) {
        throw new Error('id_egresado is undefined for an egresado');
      }

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
          fecha_nacimiento: egresado.fecha_nacimiento,
          is_active: egresado.is_active,
          id_estado: egresado.id_estado,
          id_programa_educativo: egresado.id_programa_educativo,
          programa_educativo: egresado.id_programa_educativo
            ? (programaEducativoById.get(egresado.id_programa_educativo) ?? null)
            : null,
          id_periodo: egresado.id_periodo
        }
      };
    });

    return egresadosConPerfil;
  }
}
