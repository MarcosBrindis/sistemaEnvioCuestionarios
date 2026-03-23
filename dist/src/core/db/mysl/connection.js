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
exports.MysqlConnection = void 0;
exports.testConnection = testConnection;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("./env");
(0, env_1.validateDBEnv)();
exports.MysqlConnection = promise_1.default.createPool({
    host: env_1.dbEnv.host,
    user: env_1.dbEnv.user,
    password: env_1.dbEnv.password,
    database: env_1.dbEnv.database,
    port: env_1.dbEnv.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});
function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.MysqlConnection.query('SELECT 1');
            console.log('conxion establecida a la base de datos');
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
