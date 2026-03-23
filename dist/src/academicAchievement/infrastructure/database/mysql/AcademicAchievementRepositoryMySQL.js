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
exports.AcademicAchievementRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class AcademicAchievementRepositoryMySQL {
    create(idEgresado, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO logro_academico (nombre, institucion, fecha) VALUES (?, ?, ?)`, [data.name, data.institution, data.date || null]);
            const insertId = result.insertId || (result[0] && result[0].insertId);
            yield connection_1.MysqlConnection.execute(`INSERT INTO egresado_logro_academico (id_egresado, id_logro_academico) VALUES (?, ?)`, [idEgresado, insertId]);
            return Object.assign({ id_academic_achievement: insertId }, data);
        });
    }
    findAllByEgresado(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date
       FROM logro_academico a
       INNER JOIN egresado_logro_academico ea ON a.id_logro_academico = ea.id_logro_academico
       WHERE ea.id_egresado = ?`, [idEgresado]);
            return rows;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date
      FROM logro_academico a`);
            return rows;
        });
    }
    findAllWithEgresadoId() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date, ea.id_egresado
       FROM logro_academico a
       INNER JOIN egresado_logro_academico ea ON a.id_logro_academico = ea.id_logro_academico`);
            return rows;
        });
    }
    findById(idEgresado, idAchievement) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT a.id_logro_academico as id_academic_achievement, a.nombre as name, a.institucion as institution, a.fecha as date
       FROM logro_academico a
       INNER JOIN egresado_logro_academico ea ON a.id_logro_academico = ea.id_logro_academico
       WHERE ea.id_egresado = ? AND a.id_logro_academico = ?`, [idEgresado, idAchievement]);
            return rows[0] || null;
        });
    }
    update(idEgresado, idAchievement, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logro = yield this.findById(idEgresado, idAchievement);
            if (!logro)
                return null;
            yield connection_1.MysqlConnection.execute(`UPDATE logro_academico SET nombre = ?, institucion = ?, fecha = ? WHERE id_logro_academico = ?`, [data.name || logro.name, data.institution || logro.institution, data.date || logro.date, idAchievement]);
            return Object.assign(Object.assign({}, logro), data);
        });
    }
    delete(idEgresado, idAchievement) {
        return __awaiter(this, void 0, void 0, function* () {
            const logro = yield this.findById(idEgresado, idAchievement);
            if (!logro)
                return;
            yield connection_1.MysqlConnection.execute(`DELETE FROM egresado_logro_academico WHERE id_egresado = ? AND id_logro_academico = ?`, [idEgresado, idAchievement]);
            yield connection_1.MysqlConnection.execute(`DELETE FROM logro_academico WHERE id_logro_academico = ?`, [idAchievement]);
        });
    }
}
exports.AcademicAchievementRepositoryMySQL = AcademicAchievementRepositoryMySQL;
