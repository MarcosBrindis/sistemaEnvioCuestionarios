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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosInternosRepositoryMySQL = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UsuariosInternosRepositoryMySQL {
    constructor(pool) {
        this.pool = pool;
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                // Validar que el email no exista
                const [existingUser] = yield connection.query('SELECT id_usuario FROM usuario_interno WHERE email = ?', [data.email]);
                if (existingUser.length > 0) {
                    throw new Error('El email ya está registrado');
                }
                // Hash de la contraseña
                const password_hash = yield bcrypt_1.default.hash(data.password, 10);
                // Validar que id_rol exista
                const [roleExists] = yield connection.query('SELECT id_rol FROM cat_rol_usuario WHERE id_rol = ?', [data.id_rol]);
                if (roleExists.length === 0) {
                    throw new Error('Rol inválido');
                }
                // Insertar usuario
                const [result] = yield connection.query(`INSERT INTO usuario_interno (nombre, email, password_hash, id_rol, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, NOW(), NOW())`, [data.nombre, data.email, password_hash, data.id_rol]);
                const insertResult = result;
                return { id_usuario: insertResult.insertId };
            }
            finally {
                connection.release();
            }
        });
    }
    getUsers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `
      SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE 1=1
    `;
            const params = [];
            if ((filters === null || filters === void 0 ? void 0 : filters.id_rol) !== undefined) {
                query += ' AND ui.id_rol = ?';
                params.push(filters.id_rol);
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.is_active) !== undefined) {
                query += ' AND ui.is_active = ?';
                params.push(filters.is_active ? 1 : 0);
            }
            if (filters === null || filters === void 0 ? void 0 : filters.search) {
                query += ' AND (ui.nombre LIKE ? OR ui.email LIKE ?)';
                const searchPattern = `%${filters.search}%`;
                params.push(searchPattern, searchPattern);
            }
            query += ' ORDER BY ui.created_at DESC';
            const [rows] = yield this.pool.query(query, params);
            return this.mapRows(rows);
        });
    }
    getUserById(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query(`SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE ui.id_usuario = ?`, [id_usuario]);
            const results = rows;
            if (results.length === 0)
                return null;
            return this.mapRows(results)[0];
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query(`SELECT 
        ui.id_usuario,
        ui.nombre,
        ui.email,
        ui.id_rol,
        cru.nombre as rol_nombre,
        ui.is_active,
        ui.created_at,
        ui.updated_at
      FROM usuario_interno ui
      JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
      WHERE ui.email = ?`, [email]);
            const results = rows;
            if (results.length === 0)
                return null;
            return this.mapRows(results)[0];
        });
    }
    getRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query(`SELECT id_rol, nombre
       FROM cat_rol_usuario
       ORDER BY id_rol ASC`);
            return rows;
        });
    }
    updateUser(id_usuario, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.pool.getConnection();
            try {
                const updates = [];
                const params = [];
                if (data.nombre !== undefined) {
                    updates.push('nombre = ?');
                    params.push(data.nombre);
                }
                if (data.email !== undefined) {
                    // Validar que el email no esté en uso por otro usuario
                    const [existingUser] = yield connection.query('SELECT id_usuario FROM usuario_interno WHERE email = ? AND id_usuario != ?', [data.email, id_usuario]);
                    if (existingUser.length > 0) {
                        throw new Error('El email ya está en uso');
                    }
                    updates.push('email = ?');
                    params.push(data.email);
                }
                if (data.id_rol !== undefined) {
                    // Validar que id_rol exista
                    const [roleExists] = yield connection.query('SELECT id_rol FROM cat_rol_usuario WHERE id_rol = ?', [data.id_rol]);
                    if (roleExists.length === 0) {
                        throw new Error('Rol inválido');
                    }
                    updates.push('id_rol = ?');
                    params.push(data.id_rol);
                }
                if (data.is_active !== undefined) {
                    updates.push('is_active = ?');
                    params.push(data.is_active ? 1 : 0);
                }
                if (updates.length === 0)
                    return true;
                updates.push('updated_at = NOW()');
                params.push(id_usuario);
                const query = `UPDATE usuario_interno SET ${updates.join(', ')} WHERE id_usuario = ?`;
                yield connection.query(query, params);
                return true;
            }
            finally {
                connection.release();
            }
        });
    }
    changePassword(id_usuario, password_hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.query('UPDATE usuario_interno SET password_hash = ?, updated_at = NOW() WHERE id_usuario = ?', [password_hash, id_usuario]);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    }
    deactivateUser(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.query('UPDATE usuario_interno SET is_active = 0, updated_at = NOW() WHERE id_usuario = ?', [id_usuario]);
            const updateResult = result;
            return updateResult.affectedRows > 0;
        });
    }
    assignPrograms(id_usuario, id_programas) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id_programas.length === 0)
                return true;
            const connection = yield this.pool.getConnection();
            try {
                const [userRoleResult] = yield connection.query(`SELECT cru.nombre FROM usuario_interno ui
         JOIN cat_rol_usuario cru ON ui.id_rol = cru.id_rol
         WHERE ui.id_usuario = ?`, [id_usuario]);
                const userRoles = userRoleResult;
                if (userRoles.length === 0)
                    throw new Error('Usuario no encontrado');
                const rolNombre = userRoles[0].nombre;
                if (rolNombre !== 'director_programa_educativo') {
                    throw new Error('Solo los directores de programa pueden tener asignaciones');
                }
                yield connection.query('DELETE FROM usuario_programa_educativo WHERE id_usuario = ?', [
                    id_usuario,
                ]);
                for (const id_programa of id_programas) {
                    const [programExists] = yield connection.query('SELECT id_programa_educativo FROM programa_educativo WHERE id_programa_educativo = ?', [id_programa]);
                    if (programExists.length === 0) {
                        throw new Error(`Programa ${id_programa} no existe`);
                    }
                    yield connection.query('INSERT INTO usuario_programa_educativo (id_usuario, id_programa_educativo) VALUES (?, ?)', [id_usuario, id_programa]);
                }
                return true;
            }
            finally {
                connection.release();
            }
        });
    }
    unassignProgram(id_usuario, id_programa) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.pool.query('DELETE FROM usuario_programa_educativo WHERE id_usuario = ? AND id_programa_educativo = ?', [id_usuario, id_programa]);
            const deleteResult = result;
            return deleteResult.affectedRows > 0;
        });
    }
    getUserPrograms(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.pool.query(`SELECT 
        upe.id_programa_educativo as id_programa,
        pe.nombre as nombre_programa
      FROM usuario_programa_educativo upe
      JOIN programa_educativo pe ON upe.id_programa_educativo = pe.id_programa_educativo
      WHERE upe.id_usuario = ?
      ORDER BY pe.nombre`, [id_usuario]);
            return rows;
        });
    }
    mapRows(rows) {
        return rows.map((row) => ({
            id_usuario: row.id_usuario,
            nombre: row.nombre,
            email: row.email,
            id_rol: row.id_rol,
            rol_nombre: row.rol_nombre,
            is_active: Boolean(row.is_active),
            created_at: row.created_at,
            updated_at: row.updated_at,
        }));
    }
}
exports.UsuariosInternosRepositoryMySQL = UsuariosInternosRepositoryMySQL;
