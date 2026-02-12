import { AnalyticsRepository, QuestionWithOptions } from '../../domain/port/AnalyticsRepository';
import { SurveyStats } from '../../domain/model/SurveyStats';

export class GenerateSurveyReportUseCase {
  constructor(private repo: AnalyticsRepository) {}

  async execute(id_encuesta: number): Promise<SurveyStats> {
    const meta = await this.repo.getSurveyMetadata(id_encuesta);
    if (!meta) throw new Error('Encuesta no encontrada.');

    const questions = await this.repo.getQuestionsWithOptions(id_encuesta);
    const statsMap = this.initializeStats(questions);
    const optionLabelMap = this.buildOptionLabelMap(questions);
    const likertQuestionIds = this.getLikertQuestionIds(questions);

    const stream = this.repo.getResponsesStream(id_encuesta);

    await new Promise<void>((resolve, reject) => {
      stream.on('data', (row: any) => {
        const raw = row?.respuestas_json;
        let parsed: any;
        try {
          parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        } catch {
          return;
        }

        let responses: any[] = [];
        if (Array.isArray(parsed)) {
          responses = parsed;
        } else if (typeof parsed === 'object' && parsed !== null) {
          responses = Object.entries(parsed).map(([questionId, valor]) => ({
            id_pregunta: questionId,
            valor
          }));
        } else {
          return;
        }

        for (const item of responses) {
          const questionId = Number(item?.id_pregunta);
          if (!questionId) continue;
          const valueRaw = item?.valor;
          const isLikert = likertQuestionIds.has(questionId);
          const questionMap = statsMap.get(questionId) || new Map<string, number>();

          const values = Array.isArray(valueRaw) ? valueRaw : [valueRaw];
          for (const value of values) {
            const label = this.resolveLabel(optionLabelMap, questionId, value, isLikert);
            if (!label) continue;
            questionMap.set(label, (questionMap.get(label) || 0) + 1);
          }

          statsMap.set(questionId, questionMap);
        }
      });

      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    const charts = questions.map((q) => {
      const datasetMap = statsMap.get(q.id_pregunta) || new Map<string, number>();

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
  }

  private initializeStats(questions: QuestionWithOptions[]): Map<number, Map<string, number>> {
    const stats = new Map<number, Map<string, number>>();
    for (const q of questions) {
      const optionMap = new Map<string, number>();
      if (this.isLikertQuestion(q)) {
        for (const label of this.getLikertScaleLabels()) {
          optionMap.set(label, 0);
        }
      } else {
        for (const op of q.opciones) {
          const label = op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta);
          optionMap.set(label, 0);
        }
      }
      stats.set(q.id_pregunta, optionMap);
    }
    return stats;
  }

  private buildOptionLabelMap(questions: QuestionWithOptions[]): Map<number, Map<string, string>> {
    const map = new Map<number, Map<string, string>>();
    for (const q of questions) {
      const optionMap = new Map<string, string>();
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

  private resolveLabel(
    optionLabelMap: Map<number, Map<string, string>>,
    questionId: number,
    valueRaw: any,
    isLikert: boolean
  ): string | null {
    if (valueRaw === null || valueRaw === undefined) return null;
    const key = isLikert ? this.normalizeLikertLabel(String(valueRaw)) : String(valueRaw);
    const map = optionLabelMap.get(questionId);
    if (map && map.has(key)) return map.get(key) || null;
    return key;
  }

  private isLikertQuestion(question: QuestionWithOptions): boolean {
    return (question.tipo_pregunta || '').toLowerCase().includes('likert');
  }

  private getLikertQuestionIds(questions: QuestionWithOptions[]): Set<number> {
    const ids = new Set<number>();
    for (const q of questions) {
      if (this.isLikertQuestion(q)) ids.add(q.id_pregunta);
    }
    return ids;
  }

  private getLikertScaleLabels(): string[] {
    return ['1', '2', '3', '4', '5'];
  }

  private normalizeLikertLabel(value: string): string {
    const normalized = value.trim().toLowerCase();
    if (normalized.startsWith('likert-')) {
      const suffix = normalized.replace('likert-', '');
      if (/^[1-5]$/.test(suffix)) return suffix;
    }
    if (/^[1-5]$/.test(normalized)) return normalized;
    return value;
  }

  private getChartType(question: QuestionWithOptions): string {
    const tipo = (question.tipo_pregunta || '').toLowerCase();
    if (tipo.includes('abierta') || tipo.includes('texto')) return 'text';
    if (question.opciones.length >= 5) return 'radar';
    return 'bar';
  }
}
