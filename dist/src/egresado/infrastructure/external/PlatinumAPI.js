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
exports.PeriodoParser = exports.PlatinumAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class PlatinumAPI {
    constructor() {
        this.baseURL = process.env.PLATINUM_API_URL;
        this.client = axios_1.default.create({
            baseURL: this.baseURL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
    getPeriodos() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.client.get('/getperiodos_software');
                return response.data;
            }
            catch (error) {
                const err = error;
                console.error('Error obteniendo periodos de Platinum:', err);
                let errorMessage = 'Error al obtener periodos';
                if (axios_1.default.isAxiosError(err)) {
                    errorMessage += `: ${(_a = err.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = err.response) === null || _b === void 0 ? void 0 : _b.statusText}`;
                }
                else {
                    errorMessage += `: ${err.message}`;
                }
                throw new Error(errorMessage);
            }
        });
    }
    getCarreras() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.client.get('/getcarreras_software');
                return response.data;
            }
            catch (error) {
                const err = error;
                console.error('Error obteniendo carreras de Platinum:', err);
                let errorMessage = 'Error al obtener carreras';
                if (axios_1.default.isAxiosError(err)) {
                    errorMessage += `: ${(_a = err.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = err.response) === null || _b === void 0 ? void 0 : _b.statusText}`;
                }
                else {
                    errorMessage += `: ${err.message}`;
                }
                throw new Error(errorMessage);
            }
        });
    }
    getAlumnos(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield this.client.post('/getalumnos_software', params || {});
                return response.data;
            }
            catch (error) {
                const err = error;
                console.error('Error obteniendo alumnos de Platinum:', err);
                let errorMessage = 'Error al obtener alumnos';
                if (axios_1.default.isAxiosError(err)) {
                    errorMessage += `: ${(_a = err.response) === null || _a === void 0 ? void 0 : _a.status} - ${(_b = err.response) === null || _b === void 0 ? void 0 : _b.statusText}`;
                }
                else {
                    errorMessage += `: ${err.message}`;
                }
                throw new Error(errorMessage);
            }
        });
    }
}
exports.PlatinumAPI = PlatinumAPI;
class PeriodoParser {
    static parsePeriodoToDates(periodoStr) {
        try {
            const partes = periodoStr.split(' ');
            if (partes.length < 2)
                return null;
            const mesesRango = partes[0];
            const año = parseInt(partes[1]);
            const meses = {
                'ENE': 1, 'FEB': 2, 'MAR': 3, 'ABR': 4, 'MAY': 5, 'JUN': 6,
                'JUL': 7, 'AGO': 8, 'SEP': 9, 'OCT': 10, 'NOV': 11, 'DIC': 12
            };
            const [mesInicioStr, mesFinStr] = mesesRango.split('-');
            const mesInicio = meses[mesInicioStr.toUpperCase()];
            const mesFin = meses[mesFinStr.toUpperCase()];
            if (!mesInicio || !mesFin || isNaN(año)) {
                return null;
            }
            const fecha_inicio = new Date(año, mesInicio - 1, 1);
            const fecha_fin = new Date(año, mesFin, 0);
            return { fecha_inicio, fecha_fin };
        }
        catch (error) {
            const err = error;
            console.warn(`Error parseando periodo: ${periodoStr}`, err);
            return null;
        }
    }
    static formatDateForDB(date) {
        return date.toISOString().split('T')[0];
    }
}
exports.PeriodoParser = PeriodoParser;
