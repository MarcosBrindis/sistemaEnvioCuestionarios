import { EmailAccountRepository } from '../../domain/port/EmailAccountRepository';

export class UpdateAccountUseCase {
  constructor(private repo: EmailAccountRepository) {}

  async execute(id: number, data: any): Promise<any> {
    return this.repo.update(id, data);
  }
}
