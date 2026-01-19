import { MailerService, SMTPConfig } from '../../domain/port/MailerService';
import { EmailJob } from '../../domain/model/EmailJob';

const nodemailer = require('nodemailer');

export class NodemailerService implements MailerService {
  async sendMail(config: SMTPConfig, job: EmailJob): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: {
        user: config.user,
        pass: config.pass
      }
    });

    await transporter.sendMail({
      from: config.user,
      to: job.to,
      subject: job.subject,
      html: job.html,
      text: job.text
    });
  }
}
