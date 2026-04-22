import {
  AutomaticEvent,
  AutomaticEventPayload,
  AutomaticEventType
} from '../model/AutomaticEvent';
import { AutomaticEventRun } from '../model/AutomaticEventRun';

export interface CreateAutomaticEventInput {
  name: string;
  event_type: AutomaticEventType;
  cron_expression: string;
  timezone: string;
  payload: AutomaticEventPayload;
  is_active: boolean;
  starts_at?: Date | null;
  ends_at?: Date | null;
  next_run_at?: Date | null;
  created_by: number;
}

export interface UpdateAutomaticEventInput {
  name?: string;
  event_type?: AutomaticEventType;
  cron_expression?: string;
  timezone?: string;
  payload?: AutomaticEventPayload;
  starts_at?: Date | null;
  ends_at?: Date | null;
  next_run_at?: Date | null;
  updated_by: number;
}

export interface CreateRunInput {
  id_event: number;
  scheduled_for: Date;
  triggered_by?: number | null;
}

export interface FinishRunInput {
  id_run: number;
  status: 'success' | 'failed';
  error_message?: string | null;
  result?: unknown;
}

export interface AutomaticEventRepository {
  create(input: CreateAutomaticEventInput): Promise<AutomaticEvent>;
  findAll(): Promise<AutomaticEvent[]>;
  findById(id_event: number): Promise<AutomaticEvent | null>;
  update(id_event: number, input: UpdateAutomaticEventInput): Promise<AutomaticEvent | null>;
  setActive(id_event: number, is_active: boolean, updated_by: number): Promise<AutomaticEvent | null>;
  createRun(input: CreateRunInput): Promise<AutomaticEventRun>;
  finishRun(input: FinishRunInput): Promise<void>;
  listRuns(id_event: number): Promise<AutomaticEventRun[]>;
}
