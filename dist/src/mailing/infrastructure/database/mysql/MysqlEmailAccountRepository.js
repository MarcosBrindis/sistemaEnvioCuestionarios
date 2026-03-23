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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlEmailAccountRepository = void 0;
const BaseEmailAccountRepository_1 = require("./BaseEmailAccountRepository");
const EncryptionHelper_1 = require("../../../../core/middleware/EncryptionHelper");
const connection_1 = require("../../../../core/db/mysl/connection");
class MysqlEmailAccountRepository extends BaseEmailAccountRepository_1.BaseEmailAccountRepository {
    create(account) {
        return __awaiter(this, void 0, void 0, function* () {
            const password_encrypted = EncryptionHelper_1.EncryptionHelper.encrypt(account.password);
            const sql = `INSERT INTO sys_email_account (email, host, port, password_encrypted, daily_limit) VALUES (?, ?, ?, ?, ?)`;
            const [result] = yield connection_1.MysqlConnection.query(sql, [account.email, account.host, account.port, password_encrypted, account.daily_limit]);
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_email_account WHERE id_account = ?', [result.insertId]);
            return this.sanitize(rows[0]);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            if (data.email) {
                fields.push('email = ?');
                values.push(data.email);
            }
            if (data.host) {
                fields.push('host = ?');
                values.push(data.host);
            }
            if (data.port) {
                fields.push('port = ?');
                values.push(data.port);
            }
            if (data.daily_limit) {
                fields.push('daily_limit = ?');
                values.push(data.daily_limit);
            }
            if (data.password) {
                fields.push('password_encrypted = ?');
                values.push(EncryptionHelper_1.EncryptionHelper.encrypt(data.password));
            }
            if (!fields.length)
                throw new Error('No fields to update');
            const sql = `UPDATE sys_email_account SET ${fields.join(', ')} WHERE id_account = ?`;
            values.push(id);
            yield connection_1.MysqlConnection.query(sql, values);
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_email_account WHERE id_account = ?', [id]);
            return this.sanitize(rows[0]);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_email_account WHERE is_active = 1');
            return rows.map(this.sanitize);
        });
    }
    deactivate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_email_account SET is_active = 0 WHERE id_account = ?', [id]);
        });
    }
    sanitize(row) {
        // Nunca exponer password ni password_encrypted
        const { password_encrypted } = row, rest = __rest(row, ["password_encrypted"]);
        return rest;
    }
}
exports.MysqlEmailAccountRepository = MysqlEmailAccountRepository;
