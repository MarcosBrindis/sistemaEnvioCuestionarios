import { MysqlConnection } from '../../../../../core/db/mysl/connection';
import { ApiClient } from '../../../domain/model/ApiClient';
import { ApiClientRepository } from '../../../domain/port/ApiClientRepository';

export class MysqlApiClientRepository /* ...existing code... */ {
  // ...existing code...
  async activate(id_client: number): Promise<void> {
    await MysqlConnection.query(
      'UPDATE sys_api_client SET is_active = 1 WHERE id_client = ?',
      [id_client]
    );
  }
  // ...existing code...
}
