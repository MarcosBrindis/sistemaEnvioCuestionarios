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
exports.AuthRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class AuthRepositoryMySQL {
    validateEgresadoCredentials(curp) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM egresado WHERE curp = ? AND is_active = TRUE LIMIT 1`, [curp]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    validateInternalCredentials(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`
        SELECT
          u.id_usuario,
          u.nombre,
          u.email,
          u.password_hash,
          r.nombre AS rol
        FROM usuario_interno u
        INNER JOIN cat_rol_usuario r ON r.id_rol = u.id_rol
        WHERE u.email = ?
          AND u.is_active = TRUE
        LIMIT 1
      `, [email]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
}
exports.AuthRepositoryMySQL = AuthRepositoryMySQL;
