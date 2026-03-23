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
exports.RotateKeyController = RotateKeyController;
const dependencies_1 = require("../../dependencies");
const RotateKeyUseCase_1 = require("../../../application/usecase/RotateKeyUseCase");
function RotateKeyController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_client = parseInt(req.params.id, 10);
            const { newApiKey, client_name } = yield dependencies_1.rotateKeyUseCase.execute(id_client);
            res.status(200).json({
                data: {
                    id_client,
                    client_name,
                    new_api_key: newApiKey,
                    message: 'La llave anterior ha sido invalidada inmediatamente.'
                }
            });
        }
        catch (err) {
            if (err instanceof RotateKeyUseCase_1.ClientNotFoundError) {
                return res.status(404).json({ error: err.message });
            }
            if (err instanceof Error && err.message.includes('inactivo')) {
                return res.status(400).json({ error: err.message });
            }
            next(err);
        }
    });
}
