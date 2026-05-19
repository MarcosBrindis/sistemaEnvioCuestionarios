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
exports.DispatchBirthdayTestController = void 0;
class DispatchBirthdayTestController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    run(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const bodyTemplateId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.id_template;
                const envTemplateId = process.env.BIRTHDAY_TEMPLATE_ID;
                const id_template = Number(bodyTemplateId !== null && bodyTemplateId !== void 0 ? bodyTemplateId : envTemplateId);
                if (!id_template || Number.isNaN(id_template)) {
                    throw new Error('Configura BIRTHDAY_TEMPLATE_ID o envia id_template en el body.');
                }
                const targetEgresadoIds = Array.isArray((_b = req.body) === null || _b === void 0 ? void 0 : _b.target_egresado_ids)
                    ? req.body.target_egresado_ids
                        .map((id) => Number(id))
                        .filter((id) => Number.isInteger(id) && id > 0)
                    : [];
                const targetEmails = Array.isArray((_c = req.body) === null || _c === void 0 ? void 0 : _c.target_emails)
                    ? req.body.target_emails
                        .map((email) => String(email).trim())
                        .filter((email) => email.length > 0)
                    : [];
                if (targetEgresadoIds.length === 0 && targetEmails.length === 0) {
                    throw new Error('Envia al menos un destino de prueba en target_egresado_ids o target_emails.');
                }
                const result = yield this.useCase.execute({
                    id_template,
                    targetEgresadoIds,
                    targetEmails
                });
                res.status(200).json({ data: result });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.DispatchBirthdayTestController = DispatchBirthdayTestController;
