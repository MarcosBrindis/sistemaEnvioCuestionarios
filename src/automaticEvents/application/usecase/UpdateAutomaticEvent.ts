import {
  AutomaticEventPayload,
  AutomaticEventType
} from '../../domain/model/AutomaticEvent';
import {
  AutomaticEventRepository,
  UpdateAutomaticEventInput
} from '../../domain/port/AutomaticEventRepository';
import {
  parseOptionalDate,
  validateCronExpression,
  validatePayloadByType,
  validateTimezone
} from './validation';

interface UpdateAutomaticEventRequest {
  name?: string;
  event_type?: AutomaticEventType;
  cron_expression?: string;
  timezone?: string;
  payload?: AutomaticEventPayload;
  starts_at?: string | null;
  ends_at?: string | null;
  next_run_at?: string | null;
  updated_by: number;
}

export class UpdateAutomaticEvent {
  constructor(private readonly repository: AutomaticEventRepository) {}

  async execute(id_event: number, request: UpdateAutomaticEventRequest) {
    const current = await this.repository.findById(id_event);
    if (!current) {
      return null;
    }

    if (request.cron_expression !== undefined) {
      validateCronExpression(request.cron_expression);
    }

    if (request.timezone !== undefined) {
      validateTimezone(request.timezone);
    }

    const mergedEventType = request.event_type ?? current.event_type;
    const mergedPayload = request.payload ?? current.payload;
    validatePayloadByType(mergedEventType, mergedPayload);

    if (request.name !== undefined && !request.name.trim()) {
      throw new Error('name no puede estar vacio.');
    }

    const input: UpdateAutomaticEventInput = {
      name: request.name?.trim(),
      event_type: request.event_type,
      cron_expression: request.cron_expression,
      timezone: request.timezone,
      payload: request.payload,
      starts_at: parseOptionalDate(request.starts_at, 'starts_at'),
      ends_at: parseOptionalDate(request.ends_at, 'ends_at'),
      next_run_at: parseOptionalDate(request.next_run_at, 'next_run_at'),
      updated_by: request.updated_by
    };

    return this.repository.update(id_event, input);
  }
}
