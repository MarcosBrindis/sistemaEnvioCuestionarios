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
exports.GetAllEgresadosWithAchievements = void 0;
class GetAllEgresadosWithAchievements {
    constructor(egresadoRepo, programaRepo) {
        this.egresadoRepo = egresadoRepo;
        this.programaRepo = programaRepo;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const [egresados, programasEducativos] = yield Promise.all([
                this.egresadoRepo.findAll(),
                this.programaRepo.findAll()
            ]);
            const programaEducativoById = new Map(programasEducativos.map((programa) => [programa.id_programa_educativo, programa.nombre]));
            const egresadosConPerfil = egresados.map((egresado) => {
                var _a;
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
                            ? ((_a = programaEducativoById.get(egresado.id_programa_educativo)) !== null && _a !== void 0 ? _a : null)
                            : null,
                        id_periodo: egresado.id_periodo
                    }
                };
            });
            return egresadosConPerfil;
        });
    }
}
exports.GetAllEgresadosWithAchievements = GetAllEgresadosWithAchievements;
