"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authEgresado = authEgresado;
/**
 * Middleware que valida que el usuario esté autenticado.
 * Permite acceso solo si req.session.user existe.
 */
function authEgresado(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    if (req.session.user.rol !== 'egresado') {
        return res.status(403).json({ error: 'No autorizado para este recurso' });
    }
    next();
}
