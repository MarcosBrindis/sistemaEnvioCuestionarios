import { EmailAccountRepository } from '../../domain/port/EmailAccountRepository';

export class GetAccountsUseCase {
  constructor(private repo: EmailAccountRepository) {}

  async execute(): Promise<any[]> {
    return this.repo.findAll();
  }
}
