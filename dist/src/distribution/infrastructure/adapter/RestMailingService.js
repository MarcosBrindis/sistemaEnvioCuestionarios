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
exports.RestMailingService = void 0;
const axios_1 = __importDefault(require("axios"));
class RestMailingService {
    sendEmail(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseUrl = process.env.MAILING_SERVICE_URL || '';
            const apiKey = process.env.MAILING_SERVICE_KEY || '';
            if (!baseUrl || !apiKey) {
                throw new Error('MAILING_SERVICE_URL y MAILING_SERVICE_KEY deben estar configuradas.');
            }
            const url = `${baseUrl.replace(/\/+$/, '')}/send`;
            yield axios_1.default.post(url, payload, {
                headers: { 'x-api-key': apiKey }
            });
        });
    }
}
exports.RestMailingService = RestMailingService;
