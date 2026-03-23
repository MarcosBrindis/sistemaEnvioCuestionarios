"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProgramaEducativoRepository = exports.BasePeriodoRepository = exports.BaseEgresadoRepository = void 0;
class BaseEgresadoRepository {
    create(_data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findByMatricula(_matricula) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findAll() {
        return Promise.reject(new Error('Method not implemented'));
    }
    existsByMatricula(_matricula) {
        return Promise.reject(new Error('Method not implemented'));
    }
    batchCreate(_egresados) {
        return Promise.reject(new Error('Method not implemented'));
    }
    buscarEgresadosAvanzado(_filtros) {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseEgresadoRepository = BaseEgresadoRepository;
class BasePeriodoRepository {
    create(_data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findByCohorte(_cohorte) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findByPeriodoIdExterno(_periodo_id_externo) {
        return Promise.reject(new Error('Method not implemented'));
    }
    updatePeriodoIdExterno(_cohorte, _periodo_id_externo) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findAll() {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BasePeriodoRepository = BasePeriodoRepository;
class BaseProgramaEducativoRepository {
    create(_data) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findByIdOrNombre(_id, _nombre) {
        return Promise.reject(new Error('Method not implemented'));
    }
    findAll() {
        return Promise.reject(new Error('Method not implemented'));
    }
}
exports.BaseProgramaEducativoRepository = BaseProgramaEducativoRepository;
