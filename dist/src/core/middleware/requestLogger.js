"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
/**
 * Middleware simple para logging de peticiones HTTP
 * Imprime información básica de cada petición
 */
const requestLogger = (req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next();
};
exports.requestLogger = requestLogger;
