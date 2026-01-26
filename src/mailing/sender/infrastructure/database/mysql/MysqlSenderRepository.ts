import { SenderRepository } from '../../../domain/port/SenderRepository';
import { EmailAccount } from '../../../domain/model/EmailAccount';
import { MysqlConnection } from '../../../../../core/db/mysl/connection';

export class MysqlSenderRepository implements SenderRepository {
  async getActiveAccounts(): Promise<EmailAccount[]> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT id_account, email, host, port, password_encrypted, daily_limit, current_usage, is_active FROM sys_email_account WHERE is_active = 1'
    );
    return rows as EmailAccount[];
  }

  async incrementUsage(id_account: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE sys_email_account SET current_usage = current_usage + 1 WHERE id_account = ?',
      [id_account]
    );
  }

  async deactivateAccount(id_account: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE sys_email_account SET is_active = 0 WHERE id_account = ?',
      [id_account]
    );
  }
}
