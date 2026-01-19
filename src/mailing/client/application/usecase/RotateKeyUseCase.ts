import { ApiClientRepository } from '../../domain/port/ApiClientRepository';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class ClientNotFoundError extends Error {
  constructor(id: number) {
    super(`Cliente con id ${id} no encontrado.`);
    this.name = 'ClientNotFoundError';
  }
}

export class RotateKeyUseCase {
  constructor(private repo: ApiClientRepository) {}

  async execute(id_client: number): Promise<{ newApiKey: string; client_name: string; id_client: number }> {
    const client = await this.repo.findById(id_client);
    if (!client) throw new ClientNotFoundError(id_client);
    if (!client.is_active) throw new Error('No se puede rotar la clave de un cliente inactivo.');
    const newApiKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
    const newPrefix = newApiKey.substring(0, 7);
    const newHash = await bcrypt.hash(newApiKey, 10);
    await this.repo.updateCredentials(id_client, newHash, newPrefix);
    return { newApiKey, client_name: client.client_name, id_client };
  }
}
