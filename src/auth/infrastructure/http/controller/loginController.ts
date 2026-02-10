import { Request, Response } from 'express';
import { loginEgresadoUsecase } from '../../dependencies';

export const loginController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data || data.type !== 'auth') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const attrs = data.attributes || {};
    if (!attrs.curp) {
      return res.status(400).json({ error: 'La curp es obligatoria' });
    }
    const loginResult = await loginEgresadoUsecase.execute(attrs.curp);
    if (!loginResult) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    req.session.user = loginResult.user;
    res.status(200).json({
      data: {
        type: 'egresados',
        id: String(loginResult.user.id),
        attributes: {
          nombre: loginResult.user.nombre,
          email: loginResult.email,
          mensaje: 'Sesión iniciada correctamente',
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
