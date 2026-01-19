export interface ApiClient {
  id_client: number;
  client_name: string;
  prefix: string;
  api_key_hash: string;
  is_active: boolean;
  created_at?: Date;
}
