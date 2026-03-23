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
exports.getEgresadoWithAchievementsController = void 0;
const getEgresadoWithAchievementsController = (useCase) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const idEgresado = parseInt(req.params.id);
            if (isNaN(idEgresado)) {
                return res.status(400).json({
                    success: false,
                    message: 'El ID del egresado debe ser un número válido'
                });
            }
            const result = yield useCase.execute(idEgresado);
            return res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            if (error.message === 'Egresado no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    });
};
exports.getEgresadoWithAchievementsController = getEgresadoWithAchievementsController;
