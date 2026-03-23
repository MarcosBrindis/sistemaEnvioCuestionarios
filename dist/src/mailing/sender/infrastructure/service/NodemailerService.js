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
exports.NodemailerService = void 0;
const nodemailer = require('nodemailer');
class NodemailerService {
    sendMail(config, job) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.port === 465,
                auth: {
                    user: config.user,
                    pass: config.pass
                }
            });
            yield transporter.sendMail({
                from: config.user,
                to: job.to,
                subject: job.subject,
                html: job.html,
                text: job.text
            });
        });
    }
}
exports.NodemailerService = NodemailerService;
