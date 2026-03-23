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
exports.MysqlTemplateRepository = void 0;
const connection_1 = require("../../../../core/db/mysl/connection");
class MysqlTemplateRepository {
    findById(id_template) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT id_template, asunto, cuerpo, layout_html FROM template_correo WHERE id_template = ?', [id_template]);
            return rows[0] || null;
        });
    }
}
exports.MysqlTemplateRepository = MysqlTemplateRepository;
