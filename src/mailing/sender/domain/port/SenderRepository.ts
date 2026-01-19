import { EmailAccount } from '../model/EmailAccount';

export interface SenderRepository {
  getActiveAccounts(): Promise<EmailAccount[]>;
  incrementUsage(id_account: number): Promise<void>;
  deactivateAccount(id_account: number): Promise<void>;
}
