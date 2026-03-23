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
exports.requireAuth = requireAuth;
exports.requireRoles = requireRoles;
exports.requireSelfOrRoles = requireSelfOrRoles;
exports.getDirectorProgramIds = getDirectorProgramIds;
exports.requireProgramScopeOnEgresadoParam = requireProgramScopeOnEgresadoParam;
const connection_1 = require("../db/mysl/connection");
function requireAuth(req, res, next) {
    var _a;
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.user)) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    return next();
}
function requireRoles(roles) {
    return (req, res, next) => {
        var _a;
        const user = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        if (!roles.includes(user.rol)) {
            return res.status(403).json({ error: 'No autorizado para este recurso' });
        }
        return next();
    };
}
function requireSelfOrRoles(paramName, roles) {
    return (req, res, next) => {
        var _a;
        const user = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        const targetId = Number(req.params[paramName]);
        if (Number.isNaN(targetId)) {
            return res.status(400).json({ error: `Parámetro ${paramName} inválido` });
        }
        if (user.rol === 'egresado') {
            if (user.id !== targetId) {
                return res.status(403).json({ error: 'No autorizado para este recurso' });
            }
            return next();
        }
        if (!roles.includes(user.rol)) {
            return res.status(403).json({ error: 'No autorizado para este recurso' });
        }
        return next();
    };
}
function getDirectorProgramIds(idUsuarioInterno) {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield connection_1.MysqlConnection.execute(`
      SELECT id_programa_educativo
      FROM usuario_programa_educativo
      WHERE id_usuario = ?
    `, [idUsuarioInterno]);
        return rows.map((row) => row.id_programa_educativo);
    });
}
function requireProgramScopeOnEgresadoParam(paramName = 'id') {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const user = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
            if (!user) {
                return res.status(401).json({ error: 'No autenticado' });
            }
            if (user.rol !== 'director_programa_educativo') {
                return next();
            }
            const idEgresado = Number(req.params[paramName]);
            if (Number.isNaN(idEgresado)) {
                return res.status(400).json({ error: `Parámetro ${paramName} inválido` });
            }
            const [egresadoRows] = yield connection_1.MysqlConnection.execute(`SELECT id_programa_educativo FROM egresado WHERE id_egresado = ? LIMIT 1`, [idEgresado]);
            if (egresadoRows.length === 0) {
                return res.status(404).json({ error: 'Egresado no encontrado' });
            }
            const idPrograma = egresadoRows[0].id_programa_educativo;
            if (!idPrograma) {
                return res.status(403).json({ error: 'No autorizado para este recurso' });
            }
            const [scopeRows] = yield connection_1.MysqlConnection.execute(`
          SELECT 1
          FROM usuario_programa_educativo
          WHERE id_usuario = ? AND id_programa_educativo = ?
          LIMIT 1
        `, [user.id, idPrograma]);
            if (scopeRows.length === 0) {
                return res.status(403).json({ error: 'No autorizado para este recurso' });
            }
            return next();
        }
        catch (error) {
            return next(error);
        }
    });
}
