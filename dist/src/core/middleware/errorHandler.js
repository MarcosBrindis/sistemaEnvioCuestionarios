"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.handleDeleteError = exports.handleUpdateError = exports.handlePostError = exports.handleGetError = void 0;
/**
 * Middleware para manejo de errores HTTP
 * Funciones específicas para cada tipo de operación
 */
/**
 * Maneja errores en operaciones GET
 */
const handleGetError = (err, _req, res, _next) => {
    console.error('Error en GET:', err.message);
    res.status(404).json({
        error: {
            status: '404',
            title: 'Resource Not Found',
            detail: err.message
        }
    });
};
exports.handleGetError = handleGetError;
/**
 * Maneja errores en operaciones POST (crear)
 */
const handlePostError = (err, _req, res, _next) => {
    console.error('Error en POST:', err.message);
    res.status(400).json({
        error: {
            status: '400',
            title: 'Bad Request',
            detail: err.message
        }
    });
};
exports.handlePostError = handlePostError;
/**
 * Maneja errores en operaciones PUT/PATCH (actualizar)
 */
const handleUpdateError = (err, _req, res, _next) => {
    console.error('Error en UPDATE:', err.message);
    res.status(400).json({
        error: {
            status: '400',
            title: 'Bad Request',
            detail: err.message
        }
    });
};
exports.handleUpdateError = handleUpdateError;
/**
 * Maneja errores en operaciones DELETE
 */
const handleDeleteError = (err, _req, res, _next) => {
    console.error('Error en DELETE:', err.message);
    res.status(400).json({
        error: {
            status: '400',
            title: 'Bad Request',
            detail: err.message
        }
    });
};
exports.handleDeleteError = handleDeleteError;
/**
 * Manejador de errores genérico (para usar como fallback)
 */
const errorHandler = (err, _req, res, _next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: {
            status: '500',
            title: 'Internal Server Error',
            detail: err.message
        }
    });
};
exports.errorHandler = errorHandler;
