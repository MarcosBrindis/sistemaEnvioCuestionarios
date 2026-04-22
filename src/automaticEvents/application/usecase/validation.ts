import cron from 'node-cron';
import {
  AutomaticEventPayload,
  AutomaticEventType,
  SurveyDispatchFilter
} from '../../domain/model/AutomaticEvent';

const ALLOWED_SURVEY_FILTERS: SurveyDispatchFilter[] = ['todos', 'pendientes', 'contestadas'];

export function validateCronExpression(expression: string): void {
  if (!cron.validate(expression)) {
    throw new Error('cron_expression invalida.');
  }
}

export function validateTimezone(timezone: string): void {
  try {
    Intl.DateTimeFormat('es-MX', { timeZone: timezone }).format(new Date());
  } catch {
    throw new Error('timezone invalida.');
  }
}

export function validatePayloadByType(eventType: AutomaticEventType, payload: AutomaticEventPayload): void {
  if (eventType === 'birthday_dispatch') {
    const birthdayPayload = payload as { id_template?: unknown; reference_date?: unknown };
    if (!Number.isInteger(birthdayPayload.id_template) || Number(birthdayPayload.id_template) <= 0) {
      throw new Error('Para birthday_dispatch debes enviar payload.id_template valido.');
    }

    if (
      birthdayPayload.reference_date !== undefined &&
      (typeof birthdayPayload.reference_date !== 'string' || Number.isNaN(new Date(birthdayPayload.reference_date).getTime()))
    ) {
      throw new Error('payload.reference_date debe ser una fecha valida (YYYY-MM-DD).');
    }

    return;
  }

  const surveyPayload = payload as {
    id_encuesta?: unknown;
    id_template?: unknown;
    filtro?: unknown;
    id_group?: unknown;
  };

  if (!Number.isInteger(surveyPayload.id_encuesta) || Number(surveyPayload.id_encuesta) <= 0) {
    throw new Error('Para survey_dispatch debes enviar payload.id_encuesta valido.');
  }

  if (!Number.isInteger(surveyPayload.id_template) || Number(surveyPayload.id_template) <= 0) {
    throw new Error('Para survey_dispatch debes enviar payload.id_template valido.');
  }

  if (typeof surveyPayload.filtro !== 'string' || !ALLOWED_SURVEY_FILTERS.includes(surveyPayload.filtro as SurveyDispatchFilter)) {
    throw new Error('payload.filtro invalido. Valores permitidos: todos, pendientes, contestadas.');
  }

  if (
    surveyPayload.id_group !== undefined &&
    (!Number.isInteger(surveyPayload.id_group) || Number(surveyPayload.id_group) <= 0)
  ) {
    throw new Error('payload.id_group debe ser un entero positivo cuando se envia.');
  }
}

export function parseOptionalDate(value: unknown, fieldName: string): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} debe ser string en formato fecha o null.`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} debe ser una fecha valida.`);
  }
  return date;
}
