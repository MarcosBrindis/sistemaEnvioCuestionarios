import { ApiClient } from '../model/ApiClient';

export interface ApiClientRepository {
  save(client_name: string, api_key_hash: string, prefix: string): Promise<ApiClient>;
  updateCredentials(id_client: number, api_key_hash: string, prefix: string): Promise<ApiClient>;
  findByName(client_name: string): Promise<ApiClient | null>;
  findById(id_client: number): Promise<ApiClient | null>;
  findByPrefix(prefix: string): Promise<ApiClient[]>;
  list(): Promise<Omit<ApiClient, 'api_key_hash'>[]>;
  revoke(id_client: number): Promise<void>;
  activate(id_client: number): Promise<void>;
}
