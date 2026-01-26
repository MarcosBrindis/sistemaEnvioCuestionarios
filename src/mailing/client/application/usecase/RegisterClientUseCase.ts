import { ApiClientRepository } from '../../domain/port/ApiClientRepository';
import { ApiClient } from '../../domain/model/ApiClient';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class ClientNameAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`El nombre del cliente '${name}' ya existe.`);
    this.name = 'ClientNameAlreadyExistsError';
  }
}

export class RegisterClientUseCase {
  constructor(private repo: ApiClientRepository) {}

  async execute(client_name: string): Promise<{ apiKey: string; client: ApiClient }> {
    if (!client_name || client_name.trim() === '') {
      throw new Error('El nombre del cliente no puede estar vacío.');
    }
    // Generar API Key segura
    const apiKey = 'sk_live_' + crypto.randomBytes(24).toString('hex');
    const prefix = apiKey.substring(0, 7);
    const api_key_hash = await bcrypt.hash(apiKey, 10);
    try {
      const client = await this.repo.save(client_name, api_key_hash, prefix);
      return { apiKey, client };
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        throw new ClientNameAlreadyExistsError(client_name);
      }
      throw err;
    }
  }
}
