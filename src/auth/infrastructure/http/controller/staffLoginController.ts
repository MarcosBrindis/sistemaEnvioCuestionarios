import { Request, Response } from 'express';
import { loginStaffUsecase } from '../../dependencies';

export const staffLoginController = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    if (!data || data.type !== 'auth-staff') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }

    const attrs = data.attributes || {};
    if (!attrs.email || !attrs.password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const loginResult = await loginStaffUsecase.execute(String(attrs.email), String(attrs.password));
    if (!loginResult) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    req.session.user = loginResult.user;

    return res.status(200).json({
      data: {
        type: 'usuarios-internos',
        id: String(loginResult.user.id),
        attributes: {
          nombre: loginResult.user.nombre,
          email: loginResult.user.email,
          rol: loginResult.user.rol,
          mensaje: 'Sesión iniciada correctamente',
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
