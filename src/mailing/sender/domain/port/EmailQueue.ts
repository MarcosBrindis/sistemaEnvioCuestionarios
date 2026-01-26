import { EmailJob } from '../model/EmailJob';

export interface EmailQueue {
  enqueue(job: EmailJob): Promise<string>;
  registerWorker(processor: (job: EmailJob) => Promise<void>): void;
}
