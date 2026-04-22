export type AutomaticEventType = 'birthday_dispatch' | 'survey_dispatch';

export type SurveyDispatchFilter = 'todos' | 'pendientes' | 'contestadas';

export interface BirthdayDispatchPayload {
  id_template: number;
  reference_date?: string;
}

export interface SurveyDispatchPayload {
  id_encuesta: number;
  id_template: number;
  filtro: SurveyDispatchFilter;
  id_group?: number;
}

export type AutomaticEventPayload = BirthdayDispatchPayload | SurveyDispatchPayload;

export interface AutomaticEvent {
  id_event: number;
  name: string;
  event_type: AutomaticEventType;
  cron_expression: string;
  timezone: string;
  payload: AutomaticEventPayload;
  is_active: boolean;
  starts_at: Date | null;
  ends_at: Date | null;
  next_run_at: Date | null;
  last_run_at: Date | null;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}
