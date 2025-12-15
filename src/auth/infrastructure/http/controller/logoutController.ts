import { Request, Response } from 'express';
import { logoutEgresadoUsecase } from '../../dependencies';

export const logoutController = async (req: Request, res: Response) => {
  try {
    await logoutEgresadoUsecase.execute(req);
    res.clearCookie('connect.sid');
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
