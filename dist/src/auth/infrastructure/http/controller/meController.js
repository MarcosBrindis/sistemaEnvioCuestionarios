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
exports.meController = void 0;
const dependencies_1 = require("../../dependencies");
const meController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionInfo = yield dependencies_1.getSessionInfoUsecase.execute(req);
        if (!sessionInfo.authenticated) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        res.status(200).json({
            data: {
                type: 'sesion',
                attributes: sessionInfo,
            },
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.meController = meController;
