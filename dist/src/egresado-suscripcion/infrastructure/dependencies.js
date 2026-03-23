"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const UnsubscribeEgresado_1 = require("../application/usecase/UnsubscribeEgresado");
const ResubscribeEgresado_1 = require("../application/usecase/ResubscribeEgresado");
const BajaCorreoRepositoryMySQL_1 = require("./database/mysql/BajaCorreoRepositoryMySQL");
const EgresadoRepositoryMySQL_1 = require("./database/mysql/EgresadoRepositoryMySQL");
const bajaCorreoRepo = new BajaCorreoRepositoryMySQL_1.BajaCorreoRepositoryMySQL();
const egresadoRepo = new EgresadoRepositoryMySQL_1.EgresadoRepositoryMySQL();
exports.dependencies = {
    unsubscribeEgresado: new UnsubscribeEgresado_1.UnsubscribeEgresado(egresadoRepo, bajaCorreoRepo),
    resubscribeEgresado: new ResubscribeEgresado_1.ResubscribeEgresado(egresadoRepo, bajaCorreoRepo),
};
