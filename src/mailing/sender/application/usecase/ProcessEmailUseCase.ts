import { SmartBalancerService, DailyQuotaExceededError } from '../service/SmartBalancerService';
import { MailerService } from '../../domain/port/MailerService';
import { SenderRepository } from '../../domain/port/SenderRepository';
import { EmailJob } from '../../domain/model/EmailJob';

export class ProcessEmailUseCase {
  constructor(
    private smartBalancer: SmartBalancerService,
    private mailerService: MailerService,
    private senderRepository: SenderRepository
  ) {}

  async execute(job: EmailJob): Promise<void> {
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt += 1;
      const { account, smtp } = await this.smartBalancer.getOptimalAccount();
      try {
        await this.mailerService.sendMail(smtp, job);
        await this.senderRepository.incrementUsage(account.id_account);
        return;
      } catch (err: any) {
        const isInvalidCredentials = err?.code === 'EAUTH' ||
          (typeof err?.message === 'string' && err.message.toLowerCase().includes('invalid'));
        if (isInvalidCredentials) {
          await this.senderRepository.deactivateAccount(account.id_account);
          continue;
        }
        if (err instanceof DailyQuotaExceededError) throw err;
        throw err;
      }
    }

    throw new Error('No fue posible enviar el correo con las cuentas disponibles.');
  }
}
