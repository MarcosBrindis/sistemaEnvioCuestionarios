"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCronExpression = validateCronExpression;
exports.validateTimezone = validateTimezone;
exports.validatePayloadByType = validatePayloadByType;
exports.parseOptionalDate = parseOptionalDate;
const node_cron_1 = __importDefault(require("node-cron"));
const ALLOWED_SURVEY_FILTERS = ['todos', 'pendientes', 'contestadas'];
function validateCronExpression(expression) {
    if (!node_cron_1.default.validate(expression)) {
        throw new Error('cron_expression invalida.');
    }
}
function validateTimezone(timezone) {
    try {
        Intl.DateTimeFormat('es-MX', { timeZone: timezone }).format(new Date());
    }
    catch (_a) {
        throw new Error('timezone invalida.');
    }
}
function validatePayloadByType(eventType, payload) {
    if (eventType === 'birthday_dispatch') {
        const birthdayPayload = payload;
        if (!Number.isInteger(birthdayPayload.id_template) || Number(birthdayPayload.id_template) <= 0) {
            throw new Error('Para birthday_dispatch debes enviar payload.id_template valido.');
        }
        if (birthdayPayload.reference_date !== undefined &&
            (typeof birthdayPayload.reference_date !== 'string' || Number.isNaN(new Date(birthdayPayload.reference_date).getTime()))) {
            throw new Error('payload.reference_date debe ser una fecha valida (YYYY-MM-DD).');
        }
        return;
    }
    const surveyPayload = payload;
    if (!Number.isInteger(surveyPayload.id_encuesta) || Number(surveyPayload.id_encuesta) <= 0) {
        throw new Error('Para survey_dispatch debes enviar payload.id_encuesta valido.');
    }
    if (!Number.isInteger(surveyPayload.id_template) || Number(surveyPayload.id_template) <= 0) {
        throw new Error('Para survey_dispatch debes enviar payload.id_template valido.');
    }
    if (typeof surveyPayload.filtro !== 'string' || !ALLOWED_SURVEY_FILTERS.includes(surveyPayload.filtro)) {
        throw new Error('payload.filtro invalido. Valores permitidos: todos, pendientes, contestadas.');
    }
    if (surveyPayload.id_group !== undefined &&
        (!Number.isInteger(surveyPayload.id_group) || Number(surveyPayload.id_group) <= 0)) {
        throw new Error('payload.id_group debe ser un entero positivo cuando se envia.');
    }
}
function parseOptionalDate(value, fieldName) {
    if (value === undefined)
        return undefined;
    if (value === null)
        return null;
    if (typeof value !== 'string') {
        throw new Error(`${fieldName} debe ser string en formato fecha o null.`);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error(`${fieldName} debe ser una fecha valida.`);
    }
    return date;
}
