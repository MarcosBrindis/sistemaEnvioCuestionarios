import { Request, Response } from 'express';
import { groupMemberRepository } from '../../dependencies';
import { AddMembersToGroup } from '../../../application/usecase/AddMembersToGroup';
import { egresadoRepository } from '../../../../egresado/infrastructure/dependencies';
// Verifica que el path sea correcto. Si no, usa '../../../egresado/infrastructure/dependencies'

export const addMembersToGroupController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { data } = req.body;
    if (!data || data.type !== 'miembros-grupo') {
      return res.status(400).json({ error: 'Tipo de recurso inválido' });
    }
    const attrs = data.attributes || {};
    if (!Array.isArray(attrs.ids_graduados) || attrs.ids_graduados.length === 0) {
      return res.status(400).json({ error: 'Debes enviar al menos un id de egresado'});
    }
    const usecase = new AddMembersToGroup(groupMemberRepository, egresadoRepository);
    await usecase.execute(id, attrs.ids_graduados);
    res.status(201).json({ meta: { message: 'Miembros agregados correctamente' } });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
