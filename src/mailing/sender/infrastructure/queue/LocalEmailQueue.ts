import { EmailQueue } from '../../domain/port/EmailQueue';
import { EmailJob } from '../../domain/model/EmailJob';

export class LocalEmailQueue implements EmailQueue {
  private queue: EmailJob[] = [];
  private processor?: (job: EmailJob) => Promise<void>;
  private running = false;
  private idCounter = 0;

  async enqueue(job: EmailJob): Promise<string> {
    this.queue.push(job);
    this.processNext();
    this.idCounter += 1;
    return String(this.idCounter);
  }

  registerWorker(processor: (job: EmailJob) => Promise<void>): void {
    this.processor = processor;
    this.processNext();
  }

  private async processNext(): Promise<void> {
    if (this.running || !this.processor) return;
    const job = this.queue.shift();
    if (!job) return;
    this.running = true;
    try {
      await this.processor(job);
    } finally {
      this.running = false;
      setImmediate(() => this.processNext());
    }
  }
}
