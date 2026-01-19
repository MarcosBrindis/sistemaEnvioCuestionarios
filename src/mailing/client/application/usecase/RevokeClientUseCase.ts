import { ApiClientRepository } from '../../domain/port/ApiClientRepository';

export class RevokeClientUseCase {
  constructor(private repo: ApiClientRepository) {}

  async execute(id_client: number): Promise<void> {
    await this.repo.revoke(id_client);
  }
}
