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
exports.MysqlSenderRepository = void 0;
const connection_1 = require("../../../../../core/db/mysl/connection");
class MysqlSenderRepository {
    getActiveAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT id_account, email, host, port, password_encrypted, daily_limit, current_usage, is_active FROM sys_email_account WHERE is_active = 1');
            return rows;
        });
    }
    incrementUsage(id_account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_email_account SET current_usage = current_usage + 1 WHERE id_account = ?', [id_account]);
        });
    }
    deactivateAccount(id_account) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_email_account SET is_active = 0 WHERE id_account = ?', [id_account]);
        });
    }
}
exports.MysqlSenderRepository = MysqlSenderRepository;
