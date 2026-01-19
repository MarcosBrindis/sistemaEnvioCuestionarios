import { BaseApiClientRepository } from './BaseApiClientRepository';
import { ApiClient } from '../../../domain/model/ApiClient';
import { ApiClientRepository } from '../../../domain/port/ApiClientRepository';

import { MysqlConnection } from '../../../../../core/db/mysl/connection';
export class MysqlApiClientRepository extends BaseApiClientRepository implements ApiClientRepository {
  async save(client_name: string, api_key_hash: string, prefix: string): Promise<ApiClient> {
    try {
      const [result]: any = await MysqlConnection.query(
        'INSERT INTO sys_api_client (client_name, api_key_hash, prefix) VALUES (?, ?, ?)',
        [client_name, api_key_hash, prefix]
      );
      return {
        id_client: result.insertId,
        client_name,
        api_key_hash,
        prefix,
        is_active: true,
        created_at: new Date()
      };
    } catch (err: any) {
      throw err;
    }
  }

  async updateCredentials(id_client: number, api_key_hash: string, prefix: string): Promise<ApiClient> {
    await MysqlConnection.query(
      'UPDATE sys_api_client SET api_key_hash = ?, prefix = ? WHERE id_client = ?',
      [api_key_hash, prefix, id_client]
    );
    const client = await this.findById(id_client);
    if (!client) throw new Error('Cliente no encontrado');
    return client;
  }

  async findByName(client_name: string): Promise<ApiClient | null> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT * FROM sys_api_client WHERE client_name = ?',
      [client_name]
    );
    return rows[0] || null;
  }

  async findById(id_client: number): Promise<ApiClient | null> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT * FROM sys_api_client WHERE id_client = ?',
      [id_client]
    );
    return rows[0] || null;
  }

  async findByPrefix(prefix: string): Promise<ApiClient[]> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT * FROM sys_api_client WHERE prefix = ? AND is_active = 1',
      [prefix]
    );
    return rows;
  }

  async list(): Promise<Omit<ApiClient, 'api_key_hash'>[]> {
    const [rows]: any = await MysqlConnection.query(
      'SELECT id_client, client_name, prefix, is_active, created_at FROM sys_api_client'
    );
    return rows;
  }

  async revoke(id_client: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE sys_api_client SET is_active = 0 WHERE id_client = ?',
      [id_client]
    );
  }
  async activate(id_client: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE sys_api_client SET is_active = 1 WHERE id_client = ?',
      [id_client]
    );
  }
}
