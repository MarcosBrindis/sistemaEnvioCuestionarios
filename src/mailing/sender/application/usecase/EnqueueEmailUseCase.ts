import { EmailQueue } from '../../domain/port/EmailQueue';
import { EmailJob } from '../../domain/model/EmailJob';

export class EnqueueEmailUseCase {
  constructor(private queue: EmailQueue) {}

  async execute(payload: EmailJob): Promise<{ jobId: string }> {
    if (!payload.to || !payload.subject) {
      throw new Error('Los campos to y subject son obligatorios.');
    }
    const jobId = await this.queue.enqueue(payload);
    return { jobId };
  }
}
