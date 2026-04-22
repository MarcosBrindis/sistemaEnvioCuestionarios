import {
  AutomaticEventPayload,
  AutomaticEventType
} from '../../domain/model/AutomaticEvent';
import {
  AutomaticEventRepository,
  CreateAutomaticEventInput
} from '../../domain/port/AutomaticEventRepository';
import {
  parseOptionalDate,
  validateCronExpression,
  validatePayloadByType,
  validateTimezone
} from './validation';

interface CreateAutomaticEventRequest {
  name: string;
  event_type: AutomaticEventType;
  cron_expression: string;
  timezone: string;
  payload: AutomaticEventPayload;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  next_run_at?: string | null;
  created_by: number;
}

export class CreateAutomaticEvent {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute(request: CreateAutomaticEventRequest) {
    if (!request.name?.trim()) {
      throw new Error('name es obligatorio.');
    }

    validateCronExpression(request.cron_expression);
    validateTimezone(request.timezone);
    validatePayloadByType(request.event_type, request.payload);

    const input: CreateAutomaticEventInput = {
      name: request.name.trim(),
      event_type: request.event_type,
      cron_expression: request.cron_expression,
      timezone: request.timezone,
      payload: request.payload,
      is_active: request.is_active ?? true,
      starts_at: parseOptionalDate(request.starts_at, 'starts_at'),
      ends_at: parseOptionalDate(request.ends_at, 'ends_at'),
      next_run_at: parseOptionalDate(request.next_run_at, 'next_run_at'),
      created_by: request.created_by
    };

    return this.repository.create(input);
  }
}
