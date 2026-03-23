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
exports.RevokeClientController = RevokeClientController;
const dependencies_1 = require("../../dependencies");
function RevokeClientController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_client = parseInt(req.params.id, 10);
            yield dependencies_1.revokeClientUseCase.execute(id_client);
            res.status(200).json({ message: 'Cliente revocado correctamente.' });
        }
        catch (err) {
            next(err);
        }
    });
}
