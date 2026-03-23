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
exports.EgresadoRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseEgresadoRepository_1 = require("./BaseEgresadoRepository");
class EgresadoRepositoryMySQL extends BaseEgresadoRepository_1.BaseEgresadoRepository {
    updatePerfil(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const campos = [];
            const valores = [];
            if (data.email !== undefined) {
                campos.push('email = ?');
                valores.push(data.email);
            }
            if (data.fecha_nacimiento !== undefined) {
                campos.push('fecha_nacimiento = ?');
                valores.push(data.fecha_nacimiento);
            }
            if (data.imagen_egresado !== undefined) {
                campos.push('imagen_egresado = ?');
                valores.push(data.imagen_egresado);
            }
            if (campos.length === 0) {
                throw new Error('No se proporcionaron campos válidos para actualizar');
            }
            valores.push(id);
            const sql = `UPDATE egresado SET ${campos.join(', ')} WHERE id_egresado = ?`;
            yield connection_1.MysqlConnection.execute(sql, valores);
            const actualizado = yield this.findById(id);
            if (!actualizado)
                throw new Error('Egresado no encontrado tras actualizar');
            return actualizado;
        });
    }
    updateEstado(id, idEstado) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.execute(`UPDATE egresado SET id_estado = ? WHERE id_egresado = ?`, [idEstado, id]);
            const actualizado = yield this.findById(id);
            if (!actualizado)
                throw new Error('Egresado no encontrado tras actualizar estado');
            return actualizado;
        });
    }
    updatePerfilCompleto(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const campos = [];
            const valores = [];
            if (data.nombre !== undefined) {
                campos.push('nombre = ?');
                valores.push(data.nombre);
            }
            if (data.primer_apellido !== undefined) {
                campos.push('primer_apellido = ?');
                valores.push(data.primer_apellido);
            }
            if (data.segundo_apellido !== undefined) {
                campos.push('segundo_apellido = ?');
                valores.push(data.segundo_apellido);
            }
            if (data.email !== undefined) {
                campos.push('email = ?');
                valores.push(data.email);
            }
            if (data.fecha_nacimiento !== undefined) {
                campos.push('fecha_nacimiento = ?');
                valores.push(data.fecha_nacimiento);
            }
            if (data.imagen_egresado !== undefined) {
                campos.push('imagen_egresado = ?');
                valores.push(data.imagen_egresado);
            }
            if (data.sinopsis !== undefined) {
                campos.push('sinopsis = ?');
                valores.push(data.sinopsis);
            }
            if (data.id_programa_educativo !== undefined) {
                campos.push('id_programa_educativo = ?');
                valores.push(data.id_programa_educativo);
            }
            if (data.id_periodo !== undefined) {
                campos.push('id_periodo = ?');
                valores.push(data.id_periodo);
            }
            if (data.id_estado !== undefined) {
                campos.push('id_estado = ?');
                valores.push(data.id_estado);
            }
            if (campos.length === 0) {
                throw new Error('No se proporcionaron campos válidos para actualizar');
            }
            valores.push(id);
            const sql = `UPDATE egresado SET ${campos.join(', ')} WHERE id_egresado = ?`;
            yield connection_1.MysqlConnection.execute(sql, valores);
            const actualizado = yield this.findById(id);
            if (!actualizado)
                throw new Error('Egresado no encontrado tras actualizar');
            return actualizado;
        });
    }
    getEstados() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT id_estado, nombre, descripcion FROM estado_egresado ORDER BY id_estado`);
            return rows;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO egresado (
        nombre, primer_apellido, segundo_apellido, matricula, 
        curp, email, imagen_egresado, fecha_nacimiento, 
        is_active, id_programa_educativo, id_periodo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                data.nombre,
                data.primer_apellido,
                data.segundo_apellido,
                data.matricula,
                data.curp,
                data.email,
                data.imagen_egresado,
                data.fecha_nacimiento,
                data.is_active,
                data.id_programa_educativo,
                data.id_periodo
            ]);
            const insertId = result.insertId;
            return this.findById(insertId);
        });
    }
    findByMatricula(matricula) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM egresado WHERE matricula = ?`, [matricula]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM egresado WHERE is_active = TRUE ORDER BY matricula`);
            return rows;
        });
    }
    existsByMatricula(matricula) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT COUNT(*) as count FROM egresado WHERE matricula = ?`, [matricula]);
            return rows[0].count > 0;
        });
    }
    batchCreate(egresados) {
        return __awaiter(this, void 0, void 0, function* () {
            if (egresados.length === 0)
                return 0;
            const valuesPlaceholders = egresados.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
            const values = egresados.flatMap(egresado => [
                egresado.nombre,
                egresado.primer_apellido,
                egresado.segundo_apellido,
                egresado.matricula,
                egresado.curp,
                egresado.email,
                egresado.imagen_egresado,
                egresado.fecha_nacimiento,
                egresado.is_active,
                egresado.id_programa_educativo,
                egresado.id_periodo
            ]);
            try {
                const [result] = yield connection_1.MysqlConnection.execute(`INSERT INTO egresado (
          nombre, primer_apellido, segundo_apellido, matricula, 
          curp, email, imagen_egresado, fecha_nacimiento, 
          is_active, id_programa_educativo, id_periodo
        ) VALUES ${valuesPlaceholders}`, values);
                return result.affectedRows || 0;
            }
            catch (error) {
                const err = error;
                console.error('Error en batch insert de egresados:', err);
                throw new Error(`Error en batch insert: ${err.message}`);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM egresado WHERE id_egresado = ?`, [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    updatePeriodoByMatricula(matricula, id_periodo) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute(`UPDATE egresado SET id_periodo = ? WHERE matricula = ? AND id_periodo IS NULL`, [id_periodo, matricula]);
            return result.affectedRows > 0;
        });
    }
    findEgresadosSinPeriodo() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute(`SELECT * FROM egresado WHERE id_periodo IS NULL`);
            return rows;
        });
    }
    buscarEgresadosAvanzado(filtros) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT e.*, p.cohorte AS cohorte_egreso, pe.nombre AS programa_educativo
      FROM egresado e
      LEFT JOIN periodo_graduado p ON e.id_periodo = p.id_periodo
      LEFT JOIN programa_educativo pe ON e.id_programa_educativo = pe.id_programa_educativo
      LEFT JOIN estado_egresado est ON e.id_estado = est.id_estado
      WHERE 1=1`;
            const params = [];
            if (filtros.id_programa_educativo) {
                sql += ' AND e.id_programa_educativo = ?';
                params.push(filtros.id_programa_educativo);
            }
            if (filtros.id_periodo_egreso) {
                sql += ' AND e.id_periodo = ?';
                params.push(filtros.id_periodo_egreso);
            }
            if (filtros.cohorte) {
                sql += ' AND p.cohorte = ?';
                params.push(String(filtros.cohorte));
            }
            if (filtros.prefijo_matricula) {
                sql += ' AND e.matricula LIKE ?';
                params.push(`${filtros.prefijo_matricula}%`);
            }
            if (filtros.estatus !== undefined && filtros.estatus !== '') {
                if (typeof filtros.estatus === 'number') {
                    sql += ' AND e.id_estado = ?';
                    params.push(filtros.estatus);
                }
                else {
                    sql += ' AND LOWER(est.nombre) = LOWER(?)';
                    params.push(filtros.estatus.trim());
                }
            }
            if (filtros.busqueda) {
                sql += ` AND (e.nombre LIKE ? OR e.primer_apellido LIKE ? OR e.segundo_apellido LIKE ? OR e.matricula LIKE ? OR e.email LIKE ? OR pe.nombre LIKE ?)`;
                const search = `%${filtros.busqueda}%`;
                params.push(search, search, search, search, search, search);
            }
            const [rows] = yield connection_1.MysqlConnection.execute(sql, params);
            return rows.map((row) => {
                var _a, _b;
                return (Object.assign(Object.assign({}, row), { programa_educativo: (_b = (_a = row.programa_educativo) !== null && _a !== void 0 ? _a : row.nombre_programa_educativo) !== null && _b !== void 0 ? _b : null }));
            });
        });
    }
}
exports.EgresadoRepositoryMySQL = EgresadoRepositoryMySQL;
