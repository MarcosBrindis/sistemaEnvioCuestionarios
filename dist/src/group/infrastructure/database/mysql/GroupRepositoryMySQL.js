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
exports.GroupRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class GroupRepositoryMySQL {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.query('INSERT INTO grupo_egresado (nombre, descripcion) VALUES (?, ?)', [data.nombre, data.descripcion]);
            return Object.assign({ id_grupo: result.insertId }, data);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM grupo_egresado');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM grupo_egresado WHERE id_grupo = ?', [id]);
            return rows[0] || null;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE grupo_egresado SET nombre = ?, descripcion = ? WHERE id_grupo = ?', [data.nombre, data.descripcion, id]);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('DELETE FROM grupo_egresado WHERE id_grupo = ?', [id]);
        });
    }
    existsByName(nombre) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT COUNT(*) as count FROM grupo_egresado WHERE nombre = ?', [nombre]);
            return rows[0].count > 0;
        });
    }
    importarMiembrosPorFiltro(idGrupo, idsEgresados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!idsEgresados.length)
                return { nuevos_agregados: 0, ya_estaban_en_grupo: 0 };
            // Evitar duplicados usando INSERT IGNORE
            const values = idsEgresados.map(id => `(${idGrupo}, ${id})`).join(',');
            const sql = `INSERT IGNORE INTO grupo_miembro (id_grupo, id_egresado) VALUES ${values}`;
            const [result] = yield connection_1.MysqlConnection.query(sql);
            // Calcular cuántos ya estaban
            const nuevos_agregados = result.affectedRows;
            const ya_estaban_en_grupo = idsEgresados.length - nuevos_agregados;
            return { nuevos_agregados, ya_estaban_en_grupo };
        });
    }
}
exports.GroupRepositoryMySQL = GroupRepositoryMySQL;
