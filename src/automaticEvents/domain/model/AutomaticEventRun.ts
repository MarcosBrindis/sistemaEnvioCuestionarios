export type AutomaticEventRunStatus = 'running' | 'success' | 'failed';

export interface AutomaticEventRun {
  id_run: number;
  id_event: number;
  scheduled_for: Date;
  started_at: Date;
  finished_at: Date | null;
  status: AutomaticEventRunStatus;
  attempts: number;
  triggered_by: number | null;
  error_message: string | null;
  result: unknown;
  created_at: Date;
}
