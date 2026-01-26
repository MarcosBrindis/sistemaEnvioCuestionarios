import { Request, Response, NextFunction } from 'express';
import { MysqlApiClientRepository } from '../../client/infrastructure/database/mysql/MysqlApiClientRepository';
import bcrypt from 'bcrypt';

const apiClientRepo = new MysqlApiClientRepository();

export async function ApiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key requerida.' });
  }
  const prefix = apiKey.substring(0, 7);
  const candidates = await apiClientRepo.findByPrefix(prefix);
  if (!candidates || candidates.length === 0) {
    return res.status(401).json({ error: 'API Key inválida.' });
  }
  for (const client of candidates) {
    if (await bcrypt.compare(apiKey, client.api_key_hash)) {
      (req as any).clientId = client.id_client;
      return next();
    }
  }
  return res.status(403).json({ error: 'API Key no autorizada.' });
}
