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
exports.RegisterClientController = RegisterClientController;
const dependencies_1 = require("../../dependencies");
const RegisterClientUseCase_1 = require("../../../application/usecase/RegisterClientUseCase");
function RegisterClientController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { client_name } = req.body;
            const { apiKey, client } = yield dependencies_1.registerClientUseCase.execute(client_name);
            res.status(201).json({
                data: {
                    id_client: client.id_client,
                    client_name: client.client_name,
                    api_key: apiKey,
                    message: 'IMPORTANTE: Copie esta llave ahora. No podrá verla nuevamente.'
                }
            });
        }
        catch (err) {
            if (err instanceof RegisterClientUseCase_1.ClientNameAlreadyExistsError) {
                return res.status(409).json({ error: err.message });
            }
            next(err);
        }
    });
}
