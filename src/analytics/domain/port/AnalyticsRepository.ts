import { Readable } from 'stream';
import { SurveyMetadata } from '../model/SurveyMetadata';

export interface QuestionOption {
  id_opcion_pregunta: number;
  texto_opcion: string | null;
  etiqueta: string | null;
}

export interface QuestionWithOptions {
  id_pregunta: number;
  texto_pregunta: string;
  tipo_pregunta: string | null;
  opciones: QuestionOption[];
}

export interface AnalyticsRepository {
  getSurveyMetadata(id_encuesta: number): Promise<SurveyMetadata | null>;
  getQuestionsWithOptions(id_encuesta: number): Promise<QuestionWithOptions[]>;
  getResponsesStream(id_encuesta: number): Readable;
}
