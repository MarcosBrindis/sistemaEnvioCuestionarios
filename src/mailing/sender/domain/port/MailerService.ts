import { EmailJob } from '../model/EmailJob';

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export interface MailerService {
  sendMail(config: SMTPConfig, job: EmailJob): Promise<void>;
}
