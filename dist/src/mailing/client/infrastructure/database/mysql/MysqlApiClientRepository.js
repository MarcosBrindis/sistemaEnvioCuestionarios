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
exports.MysqlApiClientRepository = void 0;
const BaseApiClientRepository_1 = require("./BaseApiClientRepository");
const connection_1 = require("../../../../../core/db/mysl/connection");
class MysqlApiClientRepository extends BaseApiClientRepository_1.BaseApiClientRepository {
    save(client_name, api_key_hash, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield connection_1.MysqlConnection.query('INSERT INTO sys_api_client (client_name, api_key_hash, prefix) VALUES (?, ?, ?)', [client_name, api_key_hash, prefix]);
                return {
                    id_client: result.insertId,
                    client_name,
                    api_key_hash,
                    prefix,
                    is_active: true,
                    created_at: new Date()
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateCredentials(id_client, api_key_hash, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_api_client SET api_key_hash = ?, prefix = ? WHERE id_client = ?', [api_key_hash, prefix, id_client]);
            const client = yield this.findById(id_client);
            if (!client)
                throw new Error('Cliente no encontrado');
            return client;
        });
    }
    findByName(client_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_api_client WHERE client_name = ?', [client_name]);
            return rows[0] || null;
        });
    }
    findById(id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_api_client WHERE id_client = ?', [id_client]);
            return rows[0] || null;
        });
    }
    findByPrefix(prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT * FROM sys_api_client WHERE prefix = ? AND is_active = 1', [prefix]);
            return rows;
        });
    }
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.MysqlConnection.query('SELECT id_client, client_name, prefix, is_active, created_at FROM sys_api_client');
            return rows;
        });
    }
    revoke(id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_api_client SET is_active = 0 WHERE id_client = ?', [id_client]);
        });
    }
    activate(id_client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield connection_1.MysqlConnection.query('UPDATE sys_api_client SET is_active = 1 WHERE id_client = ?', [id_client]);
        });
    }
}
exports.MysqlApiClientRepository = MysqlApiClientRepository;
