import { EmailAccountRepository } from '../../domain/port/EmailAccountRepository';

export class DeleteAccountUseCase {
  constructor(private repo: EmailAccountRepository) {}

  async execute(id: number): Promise<void> {
    return this.repo.deactivate(id);
  }
}
