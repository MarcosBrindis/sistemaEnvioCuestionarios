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
exports.PeriodoRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseEgresadoRepository_1 = require("./BaseEgresadoRepository");
class PeriodoRepositoryMySQL extends BaseEgresadoRepository_1.BasePeriodoRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO periodo_graduado (fecha_inicio, fecha_fin, cohorte, periodo_id_externo) VALUES (?, ?, ?, ?)`, [data.fecha_inicio, data.fecha_fin, data.cohorte, data.periodo_id_externo || null]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM periodo_graduado WHERE id_periodo = ?`, [insertId]);
            return rows[0];
        });
    }
    findByCohorte(cohorte) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM periodo_graduado WHERE cohorte = ?`, [cohorte]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM periodo_graduado ORDER BY fecha_inicio DESC`);
            return rows;
        });
    }
    findByPeriodoIdExterno(periodo_id_externo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM periodo_graduado WHERE periodo_id_externo = ?`, [periodo_id_externo]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    updatePeriodoIdExterno(cohorte, periodo_id_externo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`UPDATE periodo_graduado SET periodo_id_externo = ? WHERE cohorte = ?`, [periodo_id_externo, cohorte]);
        });
    }
}
exports.PeriodoRepositoryMySQL = PeriodoRepositoryMySQL;
