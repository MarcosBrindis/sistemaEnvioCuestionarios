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
exports.GroupMemberRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class GroupMemberRepositoryMySQL {
    addMembers(id_grupo, ids_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids_egresado.length)
                return;
            const values = ids_egresado.map(id => `(${id_grupo},${id})`).join(',');
            yield connection_1.MysqlConnection.query(`INSERT IGNORE INTO grupo_miembro (id_grupo, id_egresado) VALUES ${values}`);
        });
    }
    removeMember(id_grupo, id_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('DELETE FROM grupo_miembro WHERE id_grupo = ? AND id_egresado = ?', [id_grupo, id_egresado]);
        });
    }
    listMembers(id_grupo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM grupo_miembro WHERE id_grupo = ?', [id_grupo]);
            return rows;
        });
    }
    existsMember(id_grupo, id_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT COUNT(*) as count FROM grupo_miembro WHERE id_grupo = ? AND id_egresado = ?', [id_grupo, id_egresado]);
            return rows[0].count > 0;
        });
    }
}
exports.GroupMemberRepositoryMySQL = GroupMemberRepositoryMySQL;
