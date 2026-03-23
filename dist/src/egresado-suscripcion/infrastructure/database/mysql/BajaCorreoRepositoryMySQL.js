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
exports.BajaCorreoRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class BajaCorreoRepositoryMySQL {
    registrarBaja(id_egresado, motivo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO baja_correo (id_egresado, motivo, fecha_baja) VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE motivo = VALUES(motivo), fecha_baja = NOW()`, [id_egresado, motivo]);
            return {
                id_baja: result.insertId,
                id_egresado,
                motivo,
                fecha_baja: new Date(),
            };
        });
    }
    eliminarBaja(id_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`DELETE FROM baja_correo WHERE id_egresado = ?`, [id_egresado]);
        });
    }
    existeBaja(id_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM baja_correo WHERE id_egresado = ?`, [id_egresado]);
            return rows[0].count > 0;
        });
    }
}
exports.BajaCorreoRepositoryMySQL = BajaCorreoRepositoryMySQL;
