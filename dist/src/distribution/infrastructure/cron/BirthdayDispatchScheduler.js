"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.scheduleBirthdayDispatchJob = scheduleBirthdayDispatchJob;
const cron = __importStar(require("node-cron"));
function scheduleBirthdayDispatchJob(useCase) {
    const enabled = (process.env.BIRTHDAY_CRON_ENABLED || 'false').toLowerCase() === 'true';
    if (!enabled) {
        console.log('Birthday cron deshabilitado (BIRTHDAY_CRON_ENABLED=false).');
        return;
    }
    const expression = process.env.BIRTHDAY_CRON_EXPRESSION || '0 9 * * *';
    const timezone = process.env.BIRTHDAY_CRON_TIMEZONE || 'America/Mexico_City';
    const templateId = Number(process.env.BIRTHDAY_TEMPLATE_ID || '0');
    if (!templateId || Number.isNaN(templateId)) {
        throw new Error('BIRTHDAY_TEMPLATE_ID debe estar configurado para activar el cron de cumpleaños.');
    }
    if (!cron.validate(expression)) {
        throw new Error(`Expresion cron invalida para cumpleaños: ${expression}`);
    }
    let isRunning = false;
    cron.schedule(expression, () => __awaiter(this, void 0, void 0, function* () {
        if (isRunning) {
            console.log('Birthday cron omitido: ya existe una ejecucion en curso.');
            return;
        }
        isRunning = true;
        try {
            const result = yield useCase.execute({ id_template: templateId });
            console.log('Resultado birthday cron:', result);
        }
        catch (error) {
            console.error('Error en birthday cron:', error);
        }
        finally {
            isRunning = false;
        }
    }), { timezone });
    console.log(`Birthday cron programado con expresion "${expression}" en zona horaria "${timezone}".`);
}
