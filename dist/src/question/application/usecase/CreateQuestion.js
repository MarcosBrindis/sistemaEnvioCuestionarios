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
exports.CreateQuestion = void 0;
class CreateQuestion {
    constructor(repo) {
        this.repo = repo;
    }
    execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Validaciones básicas de la pregunta
            if (!data.texto_pregunta || typeof data.texto_pregunta !== 'string' || data.texto_pregunta.trim() === '') {
                throw new Error('El campo texto_pregunta es obligatorio y no puede estar vacío');
            }
            if (!data.id_tipo_pregunta || typeof data.id_tipo_pregunta !== 'number') {
                throw new Error('El campo id_tipo_pregunta es obligatorio');
            }
            const typeQuestionExists = yield this.repo.typeQuestionExists(data.id_tipo_pregunta);
            if (!typeQuestionExists) {
                throw new Error('El tipo de pregunta especificado no existe');
            }
            // Crear la pregunta
            const normalizedData = Object.assign(Object.assign({}, data), { texto_pregunta: data.texto_pregunta.trim(), es_obligatoria: (_a = data.es_obligatoria) !== null && _a !== void 0 ? _a : false });
            const createdQuestion = yield this.repo.create(normalizedData);
            // Si es tipo "likert", asignar automáticamente las opciones predefinidas
            const tipoNombre = yield this.repo.getTypeQuestionName(data.id_tipo_pregunta);
            if ((tipoNombre === null || tipoNombre === void 0 ? void 0 : tipoNombre.toLowerCase()) === 'likert') {
                try {
                    // Verificar si existen opciones likert predefinidas
                    const likertOptionsExist = yield this.repo.hasLikertOptions();
                    if (likertOptionsExist) {
                        // TODO: Cuando tengas el CRUD de opciones, aquí copiarás las opciones likert
                        // predefinidas y las asociarás a esta pregunta
                        console.log('TODO: Asignar opciones likert predefinidas a la pregunta', createdQuestion.id_pregunta);
                    }
                    else {
                        console.warn('No se encontraron opciones likert predefinidas en el sistema');
                    }
                }
                catch (error) {
                    console.warn('Error al verificar opciones likert:', error);
                }
            }
            return createdQuestion;
        });
    }
}
exports.CreateQuestion = CreateQuestion;
