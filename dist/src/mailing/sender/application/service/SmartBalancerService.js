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
exports.SmartBalancerService = exports.NoActiveAccountsError = exports.DailyQuotaExceededError = void 0;
const EncryptionHelper_1 = require("../../../../core/middleware/EncryptionHelper");
class DailyQuotaExceededError extends Error {
    constructor() {
        super('Todas las cuentas alcanzaron su límite diario de envío.');
        this.name = 'DailyQuotaExceededError';
    }
}
exports.DailyQuotaExceededError = DailyQuotaExceededError;
class NoActiveAccountsError extends Error {
    constructor() {
        super('No hay cuentas activas disponibles para envío.');
        this.name = 'NoActiveAccountsError';
    }
}
exports.NoActiveAccountsError = NoActiveAccountsError;
class SmartBalancerService {
    constructor(repo) {
        this.repo = repo;
    }
    getOptimalAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.repo.getActiveAccounts();
            if (!accounts || accounts.length === 0)
                throw new NoActiveAccountsError();
            const ranked = [...accounts].sort((a, b) => {
                const balanceA = a.daily_limit - a.current_usage;
                const balanceB = b.daily_limit - b.current_usage;
                return balanceB - balanceA;
            });
            const selected = ranked[0];
            const balance = selected.daily_limit - selected.current_usage;
            if (balance <= 0)
                throw new DailyQuotaExceededError();
            const decryptedPass = EncryptionHelper_1.EncryptionHelper.decrypt(selected.password_encrypted);
            return {
                account: selected,
                smtp: {
                    host: selected.host,
                    port: selected.port,
                    user: selected.email,
                    pass: decryptedPass
                }
            };
        });
    }
}
exports.SmartBalancerService = SmartBalancerService;
