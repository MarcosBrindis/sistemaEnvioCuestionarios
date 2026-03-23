"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dependencies = void 0;
const TipoCorreoRepositoryMySQL_1 = require("./database/mysql/TipoCorreoRepositoryMySQL");
const CreateTipoCorreo_1 = require("../application/usecase/CreateTipoCorreo");
const GetTiposCorreo_1 = require("../application/usecase/GetTiposCorreo");
const UpdateTipoCorreo_1 = require("../application/usecase/UpdateTipoCorreo");
const DeleteTipoCorreo_1 = require("../application/usecase/DeleteTipoCorreo");
const GetTiposCorreo_2 = require("../application/usecase/GetTiposCorreo");
const tipoCorreoRepo = new TipoCorreoRepositoryMySQL_1.TipoCorreoRepositoryMySQL();
exports.dependencies = {
    createTipoCorreo: new CreateTipoCorreo_1.CreateTipoCorreo(tipoCorreoRepo),
    getTiposCorreo: new GetTiposCorreo_1.GetTiposCorreo(tipoCorreoRepo),
    getTipoCorreoById: new GetTiposCorreo_2.GetTipoCorreoById(tipoCorreoRepo),
    updateTipoCorreo: new UpdateTipoCorreo_1.UpdateTipoCorreo(tipoCorreoRepo),
    deleteTipoCorreo: new DeleteTipoCorreo_1.DeleteTipoCorreo(tipoCorreoRepo),
};
