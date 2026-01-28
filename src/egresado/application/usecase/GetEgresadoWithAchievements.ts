import { EgresadoRepository } from '../../domain/port/egresadoRepository';
import { AcademicAchievementRepository } from '../../../academicAchievement/domain/port/academicAchievementRepository';
import { LaborAchievementRepository } from '../../../laborAchievement/domain/port/laborAchievementRepository';

export class GetEgresadoWithAchievements {
  constructor(
    private egresadoRepo: EgresadoRepository,
    private academicRepo: AcademicAchievementRepository,
    private laborRepo: LaborAchievementRepository
  ) {}

  async execute(idEgresado: number) {
    const egresado = await this.egresadoRepo.findById(idEgresado);
    
    if (!egresado) {
      throw new Error('Egresado no encontrado');
    }

    const [academicAchievements, laborAchievements] = await Promise.all([
      this.academicRepo.findAllByEgresado(idEgresado),
      this.laborRepo.findAllByEgresado(idEgresado)
    ]);

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
        id_programa_educativo: egresado.id_programa_educativo,
        id_periodo: egresado.id_periodo
      },
      logros_academicos: academicAchievements,
      logros_laborales: laborAchievements
    };
  }
}
