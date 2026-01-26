export interface MailingServiceClient {
  sendEmail(payload: { to: string; subject: string; html: string; text?: string }): Promise<void>;
}
