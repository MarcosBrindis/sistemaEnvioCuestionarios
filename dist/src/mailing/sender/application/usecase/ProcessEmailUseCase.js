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
exports.ProcessEmailUseCase = void 0;
const SmartBalancerService_1 = require("../service/SmartBalancerService");
class ProcessEmailUseCase {
    constructor(smartBalancer, mailerService, senderRepository) {
        this.smartBalancer = smartBalancer;
        this.mailerService = mailerService;
        this.senderRepository = senderRepository;
    }
    execute(job) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 0;
            const maxAttempts = 3;
            while (attempt < maxAttempts) {
                attempt += 1;
                const { account, smtp } = yield this.smartBalancer.getOptimalAccount();
                try {
                    yield this.mailerService.sendMail(smtp, job);
                    yield this.senderRepository.incrementUsage(account.id_account);
                    return;
                }
                catch (err) {
                    const isInvalidCredentials = (err === null || err === void 0 ? void 0 : err.code) === 'EAUTH' ||
                        (typeof (err === null || err === void 0 ? void 0 : err.message) === 'string' && err.message.toLowerCase().includes('invalid'));
                    if (isInvalidCredentials) {
                        yield this.senderRepository.deactivateAccount(account.id_account);
                        continue;
                    }
                    if (err instanceof SmartBalancerService_1.DailyQuotaExceededError)
                        throw err;
                    throw err;
                }
            }
            throw new Error('No fue posible enviar el correo con las cuentas disponibles.');
        });
    }
}
exports.ProcessEmailUseCase = ProcessEmailUseCase;
