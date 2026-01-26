import { ApiClientRepository } from '../../domain/port/ApiClientRepository';
import { ClientNotFoundError } from './RotateKeyUseCase';

export class ActivateClientUseCase {
  constructor(private repo: ApiClientRepository) {}

  async execute(id_client: number) {
    const client = await this.repo.findById(id_client);
    if (!client) throw new ClientNotFoundError(id_client);
    if (client.is_active) throw new Error('El cliente ya está activo');
    await this.repo.activate(id_client);
    return { ...client, is_active: true };
  }
}
