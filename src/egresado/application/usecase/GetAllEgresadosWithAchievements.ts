import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { AcademicAchievementRepository } from '../../../academicAchievement/domain/port/academicAchievementRepository';
import { LaborAchievementRepository } from '../../../laborAchievement/domain/port/laborAchievementRepository';

export class GetAllEgresadosWithAchievements {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private academicRepo: AcademicAchievementRepository,
    private laborRepo: LaborAchievementRepository
  ) {}

  async execute() {
    // Optimización: traer todos los datos en 3 consultas en lugar de N+1 consultas
    const [egresados, allAcademicAchievements, allLaborAchievements] = await Promise.all([
      this.egresadoRepo.findAll(),
      this.academicRepo.findAllWithEgresadoId(),
      this.laborRepo.findAllWithEgresadoId()
    ]);

    // Agrupar logros por id_egresado para búsqueda rápida
    const academicByEgresado = new Map<number, typeof allAcademicAchievements>();
    const laborByEgresado = new Map<number, typeof allLaborAchievements>();

    allAcademicAchievements.forEach(achievement => {
      if (!academicByEgresado.has(achievement.id_egresado)) {
        academicByEgresado.set(achievement.id_egresado, []);
      }
      academicByEgresado.get(achievement.id_egresado)!.push(achievement);
    });

    allLaborAchievements.forEach(achievement => {
      if (!laborByEgresado.has(achievement.id_egresado)) {
        laborByEgresado.set(achievement.id_egresado, []);
      }
      laborByEgresado.get(achievement.id_egresado)!.push(achievement);
    });

    // Mapear egresados con sus logros
    const egresadosWithAchievements = egresados.map((egresado) => {
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
          id_periodo: egresado.id_periodo
        },
        logros_academicos: academicByEgresado.get(egresado.id_egresado) || [],
        logros_laborales: laborByEgresado.get(egresado.id_egresado) || []
      };
    });

    return egresadosWithAchievements;
  }
}
