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
exports.SurveyRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const BaseSurveyRepository_1 = require("./BaseSurveyRepository");
class SurveyRepositoryMySQL extends BaseSurveyRepository_1.BaseSurveyRepository {
    findAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const page = (_a = params.page) !== null && _a !== void 0 ? _a : 1;
            const limit = (_b = params.limit) !== null && _b !== void 0 ? _b : 10;
            const offset = (page - 1) * limit;
            let where = [];
            let values = [];
            if (typeof params.isActive === 'boolean') {
                where.push('is_active = ?');
                values.push(params.isActive ? 1 : 0);
            }
            if (params.search) {
                where.push('(nombre LIKE ? OR descripcion LIKE ?)');
                values.push(`%${params.search}%`, `%${params.search}%`);
            }
            const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
            const [rows] = yield connection_1.MysqlConnection.query(`SELECT * FROM encuesta ${whereClause} ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`, [...values, limit, offset]);
            const [countRows] = yield connection_1.MysqlConnection.query(`SELECT COUNT(*) as total FROM encuesta ${whereClause}`, values);
            return {
                meta: {
                    total_records: (_d = (_c = countRows[0]) === null || _c === void 0 ? void 0 : _c.total) !== null && _d !== void 0 ? _d : 0,
                    current_page: page,
                    total_pages: Math.ceil(((_f = (_e = countRows[0]) === null || _e === void 0 ? void 0 : _e.total) !== null && _f !== void 0 ? _f : 0) / limit),
                    limit,
                },
                data: rows.map(row => ({
                    id: row.id_encuesta,
                    name: row.nombre,
                    description: row.descripcion,
                    createdAt: row.fecha_creacion,
                    isActive: !!row.is_active,
                    formId: row.id_formulario,
                    templateId: row.id_template
                })),
            };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM encuesta WHERE id_encuesta = ?', [id]);
            if (!rows[0])
                return null;
            const row = rows[0];
            // Mapear los campos de la base de datos al modelo Survey
            return {
                id: row.id_encuesta,
                name: row.nombre,
                description: row.descripcion,
                createdAt: row.fecha_creacion,
                isActive: !!row.is_active,
                formId: row.id_formulario,
                templateId: row.id_template
            };
        });
    }
    create(survey) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validación de nombre único activo
            const exists = yield this.existsActiveByName(survey.name);
            if (exists)
                throw new Error('Ya existe una encuesta activa con ese nombre');
            const [result] = yield connection_1.MysqlConnection.query('INSERT INTO encuesta (nombre, descripcion, is_active, id_formulario, id_template, fecha_creacion) VALUES (?, ?, ?, ?, ?, NOW())', [survey.name, survey.description, survey.isActive ? 1 : 0, survey.formId, survey.templateId]);
            return this.findById(result.insertId);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Restricción: Si la encuesta tiene respuestas, no se puede cambiar el formulario
            if (data.formId !== undefined) {
                const canChange = yield this.canChangeForm(id);
                if (!canChange)
                    throw new Error('No se puede cambiar el formulario porque la encuesta tiene respuestas');
            }
            // Validación de nombre único activo (si cambia el nombre)
            if (data.name) {
                const [rows] = yield connection_1.MysqlConnection.query('SELECT id_encuesta FROM encuesta WHERE nombre = ? AND is_active = 1 AND id_encuesta != ?', [data.name, id]);
                if (rows.length > 0)
                    throw new Error('Ya existe otra encuesta activa con ese nombre');
            }
            // Mapear los campos correctamente
            const fieldMap = {
                name: 'nombre',
                description: 'descripcion',
                isActive: 'is_active',
                formId: 'id_formulario',
                templateId: 'id_template'
            };
            const keys = Object.keys(data).filter(k => data[k] !== undefined);
            if (keys.length === 0)
                return this.findById(id);
            const fields = keys.map(k => `${fieldMap[k] || k} = ?`).join(', ');
            const values = keys.map(k => data[k]);
            yield connection_1.MysqlConnection.query(`UPDATE encuesta SET ${fields} WHERE id_encuesta = ?`, [...values, id]);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // "Intelligent delete": Si tiene respuestas, desactivar; si no, eliminar
            const hasResp = yield this.hasResponses(id);
            if (hasResp) {
                yield connection_1.MysqlConnection.query('UPDATE encuesta SET is_active = 0 WHERE id_encuesta = ?', [id]);
                return 'deactivated';
            }
            else {
                yield connection_1.MysqlConnection.query('DELETE FROM encuesta WHERE id_encuesta = ?', [id]);
                return 'deleted';
            }
        });
    }
    existsActiveByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT id_encuesta FROM encuesta WHERE nombre = ? AND is_active = 1', [name]);
            return rows.length > 0;
        });
    }
    hasResponses(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Busca si hay respuestas asociadas al formulario de la encuesta
            // Primero obtener el id_formulario de la encuesta
            const [encRows] = yield connection_1.MysqlConnection.query('SELECT id_formulario FROM encuesta WHERE id_encuesta = ?', [id]);
            if (!encRows[0] || !encRows[0].id_formulario)
                return false;
            const formId = encRows[0].id_formulario;
            const [rows] = yield connection_1.MysqlConnection.query('SELECT 1 FROM respuesta WHERE id_formulario = ? LIMIT 1', [formId]);
            return rows.length > 0;
        });
    }
    canChangeForm(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Solo se puede cambiar el formulario si no hay respuestas
            return !(yield this.hasResponses(id));
        });
    }
}
exports.SurveyRepositoryMySQL = SurveyRepositoryMySQL;
