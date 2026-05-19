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
exports.DispatchBirthdayController = void 0;
class DispatchBirthdayController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    run(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const bodyTemplateId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.id_template;
                const envTemplateId = process.env.BIRTHDAY_TEMPLATE_ID;
                const id_template = Number(bodyTemplateId !== null && bodyTemplateId !== void 0 ? bodyTemplateId : envTemplateId);
                if (!id_template || Number.isNaN(id_template)) {
                    throw new Error('Configura BIRTHDAY_TEMPLATE_ID o envia id_template en el body.');
                }
                const referenceDate = ((_b = req.body) === null || _b === void 0 ? void 0 : _b.reference_date) ? new Date(req.body.reference_date) : undefined;
                if (referenceDate && Number.isNaN(referenceDate.getTime())) {
                    throw new Error('reference_date debe tener formato YYYY-MM-DD.');
                }
                const result = yield this.useCase.execute({ id_template, referenceDate });
                res.status(200).json({ data: result });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.DispatchBirthdayController = DispatchBirthdayController;
