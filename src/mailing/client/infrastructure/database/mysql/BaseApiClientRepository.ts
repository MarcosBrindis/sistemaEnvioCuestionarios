import { ApiClient } from '../../../domain/model/ApiClient';
import { ApiClientRepository } from '../../../domain/port/ApiClientRepository';

export abstract class BaseApiClientRepository implements ApiClientRepository {
  async save(_client_name: string, _api_key_hash: string, _prefix: string): Promise<ApiClient> {
    throw new Error('Not implemented');
  }
  async updateCredentials(_id_client: number, _api_key_hash: string, _prefix: string): Promise<ApiClient> {
    throw new Error('Not implemented');
  }
  async findByName(_client_name: string): Promise<ApiClient | null> {
    throw new Error('Not implemented');
  }
  async findById(_id_client: number): Promise<ApiClient | null> {
    throw new Error('Not implemented');
  }
  async findByPrefix(_prefix: string): Promise<ApiClient[]> {
    throw new Error('Not implemented');
  }
  async list(): Promise<Omit<ApiClient, 'api_key_hash'>[]> {
    throw new Error('Not implemented');
  }
  async revoke(_id_client: number): Promise<void> {
    throw new Error('Not implemented');
  }
  async activate(_id_client: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
