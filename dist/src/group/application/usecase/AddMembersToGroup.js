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
exports.AddMembersToGroup = void 0;
class AddMembersToGroup {
    constructor(memberRepo, egresadoRepo) {
        this.memberRepo = memberRepo;
        this.egresadoRepo = egresadoRepo;
    }
    execute(id_grupo, ids_egresado) {
        return __awaiter(this, void 0, void 0, function* () {
            const egresados = yield Promise.all(ids_egresado.map(id => this.egresadoRepo.findById(id)));
            const activos = egresados.filter(e => e && e.is_active);
            if (activos.length !== ids_egresado.length) {
                throw new Error('Uno o más egresados no existen o no están activos');
            }
            yield this.memberRepo.addMembers(id_grupo, ids_egresado);
        });
    }
}
exports.AddMembersToGroup = AddMembersToGroup;
