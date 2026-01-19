import { BaseEmailAccountRepository } from './BaseEmailAccountRepository';
import { EmailAccount } from '../../../domain/model/EmailAccount';
import { EncryptionHelper } from '../../../../core/middleware/EncryptionHelper';
import { MysqlConnection } from '../../../../core/db/mysl/connection';

export class MysqlEmailAccountRepository extends BaseEmailAccountRepository {
  async create(account: Omit<EmailAccount, 'id_account' | 'current_usage' | 'is_active' | 'created_at'> & { password: string }): Promise<EmailAccount> {
    const password_encrypted = EncryptionHelper.encrypt(account.password);
    const sql = `INSERT INTO sys_email_account (email, host, port, password_encrypted, daily_limit) VALUES (?, ?, ?, ?, ?)`;
    const [result]: any = await MysqlConnection.query(sql, [account.email, account.host, account.port, password_encrypted, account.daily_limit]);
    const [rows]: any = await MysqlConnection.query('SELECT * FROM sys_email_account WHERE id_account = ?', [result.insertId]);
    return this.sanitize(rows[0]);
  }

  async update(id: number, data: Partial<Omit<EmailAccount, 'id_account' | 'current_usage' | 'is_active' | 'created_at'> & { password?: string }>): Promise<EmailAccount> {
    const fields: string[] = [];
    const values: any[] = [];
    if (data.email) { fields.push('email = ?'); values.push(data.email); }
    if (data.host) { fields.push('host = ?'); values.push(data.host); }
    if (data.port) { fields.push('port = ?'); values.push(data.port); }
    if (data.daily_limit) { fields.push('daily_limit = ?'); values.push(data.daily_limit); }
    if (data.password) {
      fields.push('password_encrypted = ?');
      values.push(EncryptionHelper.encrypt(data.password));
    }
    if (!fields.length) throw new Error('No fields to update');
    const sql = `UPDATE sys_email_account SET ${fields.join(', ')} WHERE id_account = ?`;
    values.push(id);
    await MysqlConnection.query(sql, values);
    const [rows]: any = await MysqlConnection.query('SELECT * FROM sys_email_account WHERE id_account = ?', [id]);
    return this.sanitize(rows[0]);
  }

  async findAll(): Promise<EmailAccount[]> {
    const [rows]: any = await MysqlConnection.query('SELECT * FROM sys_email_account WHERE is_active = 1');
    return rows.map(this.sanitize);
  }

  async deactivate(id: number): Promise<void> {
    await MysqlConnection.query('UPDATE sys_email_account SET is_active = 0 WHERE id_account = ?', [id]);
  }

  private sanitize(row: any): EmailAccount {
    // Nunca exponer password ni password_encrypted
    const { password_encrypted, ...rest } = row;
    return rest;
  }
}
