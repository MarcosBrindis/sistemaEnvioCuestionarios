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
exports.TipoCorreoRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class TipoCorreoRepositoryMySQL {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT * FROM tipo_correo WHERE id_tipo_correo = ?', [id]);
            if (rows.length === 0)
                return null;
            return rows[0];
        });
    }
    create(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute('INSERT INTO tipo_correo (tipo) VALUES (?)', [tipo]);
            return {
                id_tipo_correo: result.insertId,
                tipo
            };
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT * FROM tipo_correo ORDER BY tipo');
            return rows;
        });
    }
    update(id, tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute('UPDATE tipo_correo SET tipo = ? WHERE id_tipo_correo = ?', [tipo, id]);
            return { id_tipo_correo: id, tipo };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute('DELETE FROM tipo_correo WHERE id_tipo_correo = ?', [id]);
        });
    }
    existsByTipo(tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT COUNT(*) as count FROM tipo_correo WHERE tipo = ?', [tipo]);
            return rows[0].count > 0;
        });
    }
    isUsedInTemplates(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT COUNT(*) as count FROM template_correo WHERE id_tipo_correo = ?', [id]);
            return rows[0].count > 0;
        });
    }
}
exports.TipoCorreoRepositoryMySQL = TipoCorreoRepositoryMySQL;
