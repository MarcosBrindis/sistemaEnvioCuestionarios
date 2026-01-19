import axios from 'axios';
import { MailingServiceClient } from '../../domain/port/MailingServiceClient';

export class RestMailingService implements MailingServiceClient {
  async sendEmail(payload: { to: string; subject: string; html: string; text?: string }): Promise<void> {
    const baseUrl = process.env.MAILING_SERVICE_URL || '';
    const apiKey = process.env.MAILING_SERVICE_KEY || '';

    if (!baseUrl || !apiKey) {
      throw new Error('MAILING_SERVICE_URL y MAILING_SERVICE_KEY deben estar configuradas.');
    }

    const url = `${baseUrl.replace(/\/+$/, '')}/send`;
    await axios.post(url, payload, {
      headers: { 'x-api-key': apiKey }
    });
  }
}
