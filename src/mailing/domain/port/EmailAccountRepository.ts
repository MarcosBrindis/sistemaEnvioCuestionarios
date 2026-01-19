import { EmailAccount } from '../model/EmailAccount';

export interface EmailAccountRepository {
  create(account: Omit<EmailAccount, 'id_account' | 'current_usage' | 'is_active' | 'created_at'> & { password: string }): Promise<EmailAccount>;
  update(id: number, data: Partial<Omit<EmailAccount, 'id_account' | 'current_usage' | 'is_active' | 'created_at'> & { password?: string }>): Promise<EmailAccount>;
  findAll(): Promise<EmailAccount[]>;
  deactivate(id: number): Promise<void>;
}
