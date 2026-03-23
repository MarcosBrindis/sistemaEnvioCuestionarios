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
exports.DatosDomiciliariosRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class DatosDomiciliariosRepositoryMySQL {
    create(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      INSERT INTO datos_domiciliarios 
      (calle, colonia, numero_exterior, codigo_postal, estado, ciudad, id_egresado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
            const valores = [
                datos.calle,
                datos.colonia,
                datos.numero_exterior,
                datos.codigo_postal,
                datos.estado,
                datos.ciudad,
                datos.id_egresado
            ];
            yield connection_1.MysqlConnection.execute(sql, valores);
            const created = yield this.getByEgresadoId(datos.id_egresado);
            if (!created) {
                throw new Error('Error al crear los datos domiciliarios');
            }
            return created;
        });
    }
    getByEgresadoId(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT 
        id_datos_domiciliarios,
        calle,
        colonia,
        numero_exterior,
        codigo_postal,
        estado,
        ciudad,
        id_egresado,
        fecha_creacion,
        fecha_actualizacion
      FROM datos_domiciliarios
      WHERE id_egresado = ?
    `;
            const [rows] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            if (rows.length === 0) {
                return null;
            }
            return rows[0];
        });
    }
    update(idEgresado, datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const campos = [];
            const valores = [];
            if (datos.calle !== undefined) {
                campos.push('calle = ?');
                valores.push(datos.calle);
            }
            if (datos.colonia !== undefined) {
                campos.push('colonia = ?');
                valores.push(datos.colonia);
            }
            if (datos.numero_exterior !== undefined) {
                campos.push('numero_exterior = ?');
                valores.push(datos.numero_exterior);
            }
            if (datos.codigo_postal !== undefined) {
                campos.push('codigo_postal = ?');
                valores.push(datos.codigo_postal);
            }
            if (datos.estado !== undefined) {
                campos.push('estado = ?');
                valores.push(datos.estado);
            }
            if (datos.ciudad !== undefined) {
                campos.push('ciudad = ?');
                valores.push(datos.ciudad);
            }
            if (campos.length === 0) {
                throw new Error('No se proporcionaron campos válidos para actualizar');
            }
            valores.push(idEgresado);
            const sql = `UPDATE datos_domiciliarios SET ${campos.join(', ')} WHERE id_egresado = ?`;
            yield connection_1.MysqlConnection.execute(sql, valores);
            const updated = yield this.getByEgresadoId(idEgresado);
            if (!updated) {
                throw new Error('Error al actualizar los datos domiciliarios');
            }
            return updated;
        });
    }
    delete(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM datos_domiciliarios WHERE id_egresado = ?`;
            const [result] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            return result.affectedRows > 0;
        });
    }
    existsByEgresadoId(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as count FROM datos_domiciliarios WHERE id_egresado = ?`;
            const [rows] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            return rows[0].count > 0;
        });
    }
}
exports.DatosDomiciliariosRepositoryMySQL = DatosDomiciliariosRepositoryMySQL;
