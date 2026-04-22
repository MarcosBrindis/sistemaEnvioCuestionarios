import { AutomaticEventExecutor } from '../../domain/port/AutomaticEventExecutor';
import { AutomaticEventRepository } from '../../domain/port/AutomaticEventRepository';

export class TriggerAutomaticEvent {
  constructor(
    private readonly repository: AutomaticEventRepository,
    private readonly executor: AutomaticEventExecutor
  ) {}

  async execute(id_event: number, triggered_by: number) {
    const event = await this.repository.findById(id_event);
    if (!event) {
      return null;
    }

    const run = await this.repository.createRun({
      id_event,
      scheduled_for: new Date(),
      triggered_by
    });

    try {
      const result = await this.executor.execute(event);

      await this.repository.finishRun({
        id_run: run.id_run,
        status: 'success',
        result
      });

      return { run_id: run.id_run, status: 'success', result };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido al ejecutar el evento.';

      await this.repository.finishRun({
        id_run: run.id_run,
        status: 'failed',
        error_message: message
      });

      throw new Error(message);
    }
  }
}
