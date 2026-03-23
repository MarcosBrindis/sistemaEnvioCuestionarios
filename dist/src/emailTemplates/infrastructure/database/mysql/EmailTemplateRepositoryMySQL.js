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
exports.EmailTemplateRepositoryMySQL = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
const baseEmailTemplateRepository_1 = require("./baseEmailTemplateRepository");
class EmailTemplateRepositoryMySQL extends baseEmailTemplateRepository_1.BaseEmailTemplateRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT id_template AS id, asunto AS subject, cuerpo AS body, layout_html AS layoutHtml, id_tipo_correo AS typeId FROM template_correo');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT id_template AS id, asunto AS subject, cuerpo AS body, layout_html AS layoutHtml, id_tipo_correo AS typeId FROM template_correo WHERE id_template = ?', [id]);
            return rows.length > 0 ? rows[0] : null;
        });
    }
    create(template) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [result] = yield connection_1.MysqlConnection.execute('INSERT INTO template_correo (asunto, cuerpo, layout_html, id_tipo_correo) VALUES (?, ?, ?, ?)', [template.subject, template.body, (_a = template.layoutHtml) !== null && _a !== void 0 ? _a : null, template.typeId]);
            const insertId = result.insertId;
            return this.findById(insertId);
        });
    }
    update(id, template) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield connection_1.MysqlConnection.execute('UPDATE template_correo SET asunto = ?, cuerpo = ?, layout_html = ?, id_tipo_correo = ? WHERE id_template = ?', [template.subject, template.body, (_a = template.layoutHtml) !== null && _a !== void 0 ? _a : null, template.typeId, id]);
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.MysqlConnection.execute('DELETE FROM template_correo WHERE id_template = ?', [id]);
            return result.affectedRows > 0;
        });
    }
    isLinkedToSurvey(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.execute('SELECT COUNT(*) as count FROM encuesta WHERE id_template = ?', [id]);
            return rows[0].count > 0;
        });
    }
}
exports.EmailTemplateRepositoryMySQL = EmailTemplateRepositoryMySQL;
