import { Request, Response } from 'express';
import { getSessionInfoUsecase } from '../../dependencies';

export const meController = async (req: Request, res: Response) => {
  try {
    const sessionInfo = await getSessionInfoUsecase.execute(req);
    if (!sessionInfo.authenticated) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    res.status(200).json({
      data: {
        type: 'sesion',
        attributes: sessionInfo,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
