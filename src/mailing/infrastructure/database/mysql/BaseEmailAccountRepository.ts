import { EmailAccountRepository } from '../../../domain/port/EmailAccountRepository';
import { EmailAccount } from '../../../domain/model/EmailAccount';

export abstract class BaseEmailAccountRepository implements EmailAccountRepository {
  create(_account: any): Promise<EmailAccount> {
    return Promise.reject(new Error('Not implemented'));
  }
  update(_id: number, _data: any): Promise<EmailAccount> {
    return Promise.reject(new Error('Not implemented'));
  }
  findAll(): Promise<EmailAccount[]> {
    return Promise.reject(new Error('Not implemented'));
  }
  deactivate(_id: number): Promise<void> {
    return Promise.reject(new Error('Not implemented'));
  }
}
