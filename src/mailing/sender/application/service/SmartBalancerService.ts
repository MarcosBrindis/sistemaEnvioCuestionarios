import { SenderRepository } from '../../domain/port/SenderRepository';
import { SMTPConfig } from '../../domain/port/MailerService';
import { EmailAccount } from '../../domain/model/EmailAccount';
import { EncryptionHelper } from '../../../../core/middleware/EncryptionHelper';

export class DailyQuotaExceededError extends Error {
  constructor() {
    super('Todas las cuentas alcanzaron su límite diario de envío.');
    this.name = 'DailyQuotaExceededError';
  }
}

export class NoActiveAccountsError extends Error {
  constructor() {
    super('No hay cuentas activas disponibles para envío.');
    this.name = 'NoActiveAccountsError';
  }
}

export class SmartBalancerService {
  constructor(private repo: SenderRepository) {}

  async getOptimalAccount(): Promise<{ account: EmailAccount; smtp: SMTPConfig }> {
    const accounts = await this.repo.getActiveAccounts();
    if (!accounts || accounts.length === 0) throw new NoActiveAccountsError();

    const ranked = [...accounts].sort((a, b) => {
      const balanceA = a.daily_limit - a.current_usage;
      const balanceB = b.daily_limit - b.current_usage;
      return balanceB - balanceA;
    });

    const selected = ranked[0];
    const balance = selected.daily_limit - selected.current_usage;
    if (balance <= 0) throw new DailyQuotaExceededError();

    const decryptedPass = EncryptionHelper.decrypt(selected.password_encrypted);
    return {
      account: selected,
      smtp: {
        host: selected.host,
        port: selected.port,
        user: selected.email,
        pass: decryptedPass
      }
    };
  }
}
