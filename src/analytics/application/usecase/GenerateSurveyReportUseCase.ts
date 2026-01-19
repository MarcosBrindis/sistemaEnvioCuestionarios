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
        if (!Array.isArray(parsed)) return;

        for (const item of parsed) {
          const questionId = Number(item?.id_pregunta);
          if (!questionId) continue;
          const valueRaw = item?.valor;
          const label = this.resolveLabel(optionLabelMap, questionId, valueRaw);
          if (!label) continue;
          const questionMap = statsMap.get(questionId) || new Map<string, number>();
          questionMap.set(label, (questionMap.get(label) || 0) + 1);
          statsMap.set(questionId, questionMap);
        }
      });

      stream.on('end', () => resolve());
      stream.on('error', (err) => reject(err));
    });

    const charts = questions.map((q) => {
      const datasetMap = statsMap.get(q.id_pregunta) || new Map<string, number>();

      const dataset = q.opciones.length > 0
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
      for (const op of q.opciones) {
        const label = op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta);
        optionMap.set(label, 0);
      }
      stats.set(q.id_pregunta, optionMap);
    }
    return stats;
  }

  private buildOptionLabelMap(questions: QuestionWithOptions[]): Map<number, Map<string, string>> {
    const map = new Map<number, Map<string, string>>();
    for (const q of questions) {
      const optionMap = new Map<string, string>();
      for (const op of q.opciones) {
        const label = op.etiqueta || op.texto_opcion || String(op.id_opcion_pregunta);
        optionMap.set(String(op.id_opcion_pregunta), label);
      }
      map.set(q.id_pregunta, optionMap);
    }
    return map;
  }

  private resolveLabel(
    optionLabelMap: Map<number, Map<string, string>>,
    questionId: number,
    valueRaw: any
  ): string | null {
    if (valueRaw === null || valueRaw === undefined) return null;
    const key = String(valueRaw);
    const map = optionLabelMap.get(questionId);
    if (map && map.has(key)) return map.get(key) || null;
    return key;
  }

  private getChartType(question: QuestionWithOptions): string {
    const tipo = (question.tipo_pregunta || '').toLowerCase();
    if (tipo.includes('abierta') || tipo.includes('texto')) return 'text';
    if (question.opciones.length >= 5) return 'radar';
    return 'bar';
  }
}
