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
exports.LaborAchievementRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class LaborAchievementRepositoryMySQL {
    create(idEgresado, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO logro_laboral (empresa, puesto, fecha) VALUES (?, ?, ?)`, [data.company, data.position, data.date || null]);
            const insertId = result.insertId || (result[0] && result[0].insertId);
            yield connection_1.MysqlConnection.execute(`INSERT INTO egresado_logro_laboral (id_egresado, id_logro_laboral) VALUES (?, ?)`, [idEgresado, insertId]);
            return Object.assign({ id_labor_achievement: insertId }, data);
        });
    }
    findAllByEgresado(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral
       WHERE el.id_egresado = ?`, [idEgresado]);
            return rows;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l`);
            return rows;
        });
    }
    findAllWithEgresadoId() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date, el.id_egresado
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral`);
            return rows;
        });
    }
    findById(idEgresado, idAchievement) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT l.id_logro_laboral as id_labor_achievement, l.empresa as company, l.puesto as position, l.fecha as date
       FROM logro_laboral l
       INNER JOIN egresado_logro_laboral el ON l.id_logro_laboral = el.id_logro_laboral
       WHERE el.id_egresado = ? AND l.id_logro_laboral = ?`, [idEgresado, idAchievement]);
            return rows[0] || null;
        });
    }
    update(idEgresado, idAchievement, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const logro = yield this.findById(idEgresado, idAchievement);
            if (!logro)
                return null;
            yield connection_1.MysqlConnection.execute(`UPDATE logro_laboral SET empresa = ?, puesto = ?, fecha = ? WHERE id_logro_laboral = ?`, [data.company || logro.company, data.position || logro.position, data.date || logro.date, idAchievement]);
            return Object.assign(Object.assign({}, logro), data);
        });
    }
    delete(idEgresado, idAchievement) {
        return __awaiter(this, void 0, void 0, function* () {
            const logro = yield this.findById(idEgresado, idAchievement);
            if (!logro)
                return;
            yield connection_1.MysqlConnection.execute(`DELETE FROM egresado_logro_laboral WHERE id_egresado = ? AND id_logro_laboral = ?`, [idEgresado, idAchievement]);
            yield connection_1.MysqlConnection.execute(`DELETE FROM logro_laboral WHERE id_logro_laboral = ?`, [idAchievement]);
        });
    }
}
exports.LaborAchievementRepositoryMySQL = LaborAchievementRepositoryMySQL;
