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
exports.GenerateSurveyReportUseCase = void 0;
class GenerateSurveyReportUseCase {
    constructor(repo) {
        this.repo = repo;
    }
    execute(id_encuesta) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield this.repo.getSurveyMetadata(id_encuesta);
            if (!meta)
                throw new Error('Encuesta no encontrada.');
            const questions = yield this.repo.getQuestionsWithOptions(id_encuesta);
            const statsMap = this.initializeStats(questions);
            const optionLabelMap = this.buildOptionLabelMap(questions);
            const likertQuestionIds = this.getLikertQuestionIds(questions);
            const stream = this.repo.getResponsesStream(id_encuesta);
            yield new Promise((resolve, reject) => {
                stream.on('data', (row) => {
                    const raw = row === null || row === void 0 ? void 0 : row.respuestas_json;
                    let parsed;
                    try {
                        parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    }
                    catch (_a) {
                        return;
                    }
                    let responses = [];
                    if (Array.isArray(parsed)) {
                        responses = parsed;
                    }
                    else if (typeof parsed === 'object' && parsed !== null) {
                        responses = Object.entries(parsed).map(([questionId, valor]) => ({
                            id_pregunta: questionId,
                            valor
                        }));
                    }
                    else {
                        return;
                    }
                    for (const item of responses) {
                        const questionId = Number(item === null || item === void 0 ? void 0 : item.id_pregunta);
                        if (!questionId)
                            continue;
                        const valueRaw = item === null || item === void 0 ? void 0 : item.valor;
                        const isLikert = likertQuestionIds.has(questionId);
                        const questionMap = statsMap.get(questionId) || new Map();
                        const values = Array.isArray(valueRaw) ? valueRaw : [valueRaw];
                        for (const value of values) {
                            const label = this.resolveLabel(optionLabelMap, questionId, value, isLikert);
                            if (!label)
                                continue;
                            questionMap.set(label, (questionMap.get(label) || 0) + 1);
                        }
                        statsMap.set(questionId, questionMap);
                    }
                });
                stream.on('end', () => resolve());
                stream.on('error', (err) => reject(err));
            });
            const charts = questions.map((q) => {
                const datasetMap = statsMap.get(q.id_pregunta) || new Map();
                const dataset = this.isLikertQuestion(q)
                    ? this.getLikertScaleLabels().map((label) => ({ label, count: datasetMap.get(label) || 0 }))
                    : q.opciones.length > 0
                        ? q.opciones.map((op) => {
                            const label = op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta);
                            return { label, count: datasetMap.get(label) || 0 };
                        })
                        : Array.from(datasetMap.entries()).map(([label, count]) => ({ label, count }));
                return {
                    question_id: String(q.id_pregunta),
                    label: q.texto_pregunta,
                    chart_type: this.getChartType(q),
                    dataset
                };
            });
            return {
                survey_id: id_encuesta,
                meta: {
                    title: meta.title,
                    description: meta.description,
                    total_responses: meta.total_responses
                },
                charts
            };
        });
    }
    initializeStats(questions) {
        const stats = new Map();
        for (const q of questions) {
            const optionMap = new Map();
            if (this.isLikertQuestion(q)) {
                for (const label of this.getLikertScaleLabels()) {
                    optionMap.set(label, 0);
                }
            }
            else {
                for (const op of q.opciones) {
                    const label = op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta);
                    optionMap.set(label, 0);
                }
            }
            stats.set(q.id_pregunta, optionMap);
        }
        return stats;
    }
    buildOptionLabelMap(questions) {
        const map = new Map();
        for (const q of questions) {
            const optionMap = new Map();
            if (this.isLikertQuestion(q)) {
                for (const label of this.getLikertScaleLabels()) {
                    optionMap.set(label, label);
                    optionMap.set(`likert-${label}`, label);
                }
            }
            for (const op of q.opciones) {
                const label = this.isLikertQuestion(q)
                    ? this.normalizeLikertLabel(op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta))
                    : (op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta));
                optionMap.set(String(op.id_opcion_pregunta), label);
                if (op.etiqueta) {
                    optionMap.set(op.etiqueta, label);
                }
                if (op.texto_opcion && op.texto_opcion !== op.etiqueta) {
                    optionMap.set(op.texto_opcion, label);
                }
            }
            map.set(q.id_pregunta, optionMap);
        }
        return map;
    }
    resolveLabel(optionLabelMap, questionId, valueRaw, isLikert) {
        if (valueRaw === null || valueRaw === undefined)
            return null;
        const key = isLikert ? this.normalizeLikertLabel(String(valueRaw)) : String(valueRaw);
        const map = optionLabelMap.get(questionId);
        if (map && map.has(key))
            return map.get(key) || null;
        return key;
    }
    isLikertQuestion(question) {
        return (question.tipo_pregunta || '').toLowerCase().includes('likert');
    }
    getLikertQuestionIds(questions) {
        const ids = new Set();
        for (const q of questions) {
            if (this.isLikertQuestion(q))
                ids.add(q.id_pregunta);
        }
        return ids;
    }
    getLikertScaleLabels() {
        return ['1', '2', '3', '4', '5'];
    }
    normalizeLikertLabel(value) {
        const normalized = value.trim().toLowerCase();
        if (normalized.startsWith('likert-')) {
            const suffix = normalized.replace('likert-', '');
            if (/^[1-5]$/.test(suffix))
                return suffix;
        }
        if (/^[1-5]$/.test(normalized))
            return normalized;
        return value;
    }
    getChartType(question) {
        const tipo = (question.tipo_pregunta || '').toLowerCase();
        if (tipo.includes('abierta') || tipo.includes('texto'))
            return 'text';
        if (question.opciones.length >= 5)
            return 'radar';
        return 'bar';
    }
}
exports.GenerateSurveyReportUseCase = GenerateSurveyReportUseCase;
