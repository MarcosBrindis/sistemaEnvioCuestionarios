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
exports.CreateAccountController = void 0;
const CreateAccountController = (usecase) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, host, port, daily_limit } = req.body;
        const result = yield usecase.execute({ email, password, host, port, daily_limit });
        res.status(201).json({ data: result });
    }
    catch (error) {
        next(error);
    }
});
exports.CreateAccountController = CreateAccountController;
