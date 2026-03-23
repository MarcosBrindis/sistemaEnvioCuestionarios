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
exports.DatosLaboralesRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class DatosLaboralesRepositoryMySQL {
    create(datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      INSERT INTO datos_laborales 
      (trabaja_actualmente, nombre_empresa, puesto, id_sector, actividad_principal, id_egresado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
            const valores = [
                datos.trabaja_actualmente,
                datos.nombre_empresa || null,
                datos.puesto || null,
                datos.id_sector || null,
                datos.actividad_principal || null,
                datos.id_egresado
            ];
            yield connection_1.MysqlConnection.execute(sql, valores);
            const created = yield this.getByEgresadoId(datos.id_egresado);
            if (!created) {
                throw new Error('Error al crear los datos laborales');
            }
            return created;
        });
    }
    getByEgresadoId(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `
      SELECT 
        id_datos_laborales,
        trabaja_actualmente,
        nombre_empresa,
        puesto,
        id_sector,
        actividad_principal,
        id_egresado,
        fecha_creacion,
        fecha_actualizacion
      FROM datos_laborales
      WHERE id_egresado = ?
    `;
            const [rows] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            if (rows.length === 0) {
                return null;
            }
            const row = rows[0];
            return {
                id_datos_laborales: row.id_datos_laborales,
                trabaja_actualmente: Boolean(row.trabaja_actualmente),
                nombre_empresa: row.nombre_empresa,
                puesto: row.puesto,
                id_sector: row.id_sector,
                actividad_principal: row.actividad_principal,
                id_egresado: row.id_egresado,
                fecha_creacion: row.fecha_creacion,
                fecha_actualizacion: row.fecha_actualizacion
            };
        });
    }
    update(idEgresado, datos) {
        return __awaiter(this, void 0, void 0, function* () {
            const campos = [];
            const valores = [];
            if (datos.trabaja_actualmente !== undefined) {
                campos.push('trabaja_actualmente = ?');
                valores.push(datos.trabaja_actualmente);
            }
            if (datos.nombre_empresa !== undefined) {
                campos.push('nombre_empresa = ?');
                valores.push(datos.nombre_empresa);
            }
            if (datos.puesto !== undefined) {
                campos.push('puesto = ?');
                valores.push(datos.puesto);
            }
            if (datos.id_sector !== undefined) {
                campos.push('id_sector = ?');
                valores.push(datos.id_sector);
            }
            if (datos.actividad_principal !== undefined) {
                campos.push('actividad_principal = ?');
                valores.push(datos.actividad_principal);
            }
            if (campos.length === 0) {
                throw new Error('No se proporcionaron campos válidos para actualizar');
            }
            valores.push(idEgresado);
            const sql = `UPDATE datos_laborales SET ${campos.join(', ')} WHERE id_egresado = ?`;
            yield connection_1.MysqlConnection.execute(sql, valores);
            const updated = yield this.getByEgresadoId(idEgresado);
            if (!updated) {
                throw new Error('Error al actualizar los datos laborales');
            }
            return updated;
        });
    }
    delete(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM datos_laborales WHERE id_egresado = ?`;
            const [result] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            return result.affectedRows > 0;
        });
    }
    existsByEgresadoId(idEgresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as count FROM datos_laborales WHERE id_egresado = ?`;
            const [rows] = yield connection_1.MysqlConnection.execute(sql, [idEgresado]);
            return rows[0].count > 0;
        });
    }
}
exports.DatosLaboralesRepositoryMySQL = DatosLaboralesRepositoryMySQL;
