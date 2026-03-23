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
exports.GetPublicSurveyByUuid = void 0;
const connection_1 = require("../../../core/db/mysl/connection");
class GetPublicSurveyByUuid {
    constructor(formularioRepository) {
        this.formularioRepository = formularioRepository;
    }
    execute(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT
        ee.id_encuesta_egresados AS uuid,
        ee.is_active AS access_active,
        enc.id_encuesta,
        enc.nombre,
        enc.descripcion,
        enc.is_active AS encuesta_activa,
        enc.id_formulario,
        f.titulo,
        f.descripcion AS form_descripcion,
        f.is_active AS form_activa
      FROM encuesta_egresados ee
      INNER JOIN encuesta enc ON enc.id_encuesta = ee.id_encuesta
      INNER JOIN formulario f ON f.id_formulario = enc.id_formulario
      WHERE ee.id_encuesta_egresados = ?
      LIMIT 1`, [uuid]);
            if (!rows[0])
                return null;
            const row = rows[0];
            const questions = yield this.formularioRepository.getQuestionsWithOptionsByFormId(row.id_formulario);
            return {
                uuid: row.uuid,
                access_active: !!row.access_active,
                survey: {
                    id_encuesta: row.id_encuesta,
                    nombre: row.nombre,
                    descripcion: (_a = row.descripcion) !== null && _a !== void 0 ? _a : null,
                    is_active: !!row.encuesta_activa
                },
                form: {
                    id_formulario: row.id_formulario,
                    titulo: (_b = row.titulo) !== null && _b !== void 0 ? _b : null,
                    descripcion: (_c = row.form_descripcion) !== null && _c !== void 0 ? _c : null,
                    is_active: !!row.form_activa
                },
                questions
            };
        });
    }
}
exports.GetPublicSurveyByUuid = GetPublicSurveyByUuid;
