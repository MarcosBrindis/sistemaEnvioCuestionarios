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
exports.ProgramaEducativoRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseEgresadoRepository_1 = require("./BaseEgresadoRepository");
class ProgramaEducativoRepositoryMySQL extends BaseEgresadoRepository_1.BaseProgramaEducativoRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO programa_educativo (nombre) VALUES (?)`, [data.nombre]);
            const insertId = result.insertId;
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM programa_educativo WHERE id_programa_educativo = ?`, [insertId]);
            return rows[0];
        });
    }
    findByIdOrNombre(id, nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT * FROM programa_educativo WHERE `;
            const conditions = [];
            const params = [];
            if (id) {
                conditions.push(`id_programa_educativo = ?`);
                params.push(parseInt(id));
            }
            if (nombre) {
                conditions.push(`UPPER(nombre) = UPPER(?)`);
                params.push(nombre);
            }
            if (conditions.length === 0) {
                return null;
            }
            query += conditions.join(' OR ');
            query += ` LIMIT 1`;
            const [rows] = yield connection_1.MysqlConnection.execute(query, params);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM programa_educativo ORDER BY nombre`);
            return rows;
        });
    }
}
exports.ProgramaEducativoRepositoryMySQL = ProgramaEducativoRepositoryMySQL;
