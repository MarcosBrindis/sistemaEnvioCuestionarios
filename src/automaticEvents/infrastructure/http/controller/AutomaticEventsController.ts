import { NextFunction, Request, Response } from 'express';
import { ActivateAutomaticEvent } from '../../../application/usecase/ActivateAutomaticEvent';
import { CreateAutomaticEvent } from '../../../application/usecase/CreateAutomaticEvent';
import { DeactivateAutomaticEvent } from '../../../application/usecase/DeactivateAutomaticEvent';
import { GetAutomaticEventById } from '../../../application/usecase/GetAutomaticEventById';
import { GetAutomaticEventRuns } from '../../../application/usecase/GetAutomaticEventRuns';
import { GetAutomaticEvents } from '../../../application/usecase/GetAutomaticEvents';
import { TriggerAutomaticEvent } from '../../../application/usecase/TriggerAutomaticEvent';
import { UpdateAutomaticEvent } from '../../../application/usecase/UpdateAutomaticEvent';

export class AutomaticEventsController {
  constructor(
    private readonly createAutomaticEvent: CreateAutomaticEvent,
    private readonly getAutomaticEvents: GetAutomaticEvents,
    private readonly getAutomaticEventById: GetAutomaticEventById,
    private readonly updateAutomaticEvent: UpdateAutomaticEvent,
    private readonly activateAutomaticEvent: ActivateAutomaticEvent,
    private readonly deactivateAutomaticEvent: DeactivateAutomaticEvent,
    private readonly triggerAutomaticEvent: TriggerAutomaticEvent,
    private readonly getAutomaticEventRuns: GetAutomaticEventRuns
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created_by = req.session.user?.id;
      if (!created_by) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const data = await this.createAutomaticEvent.execute({
        ...req.body,
        created_by
      });

      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.getAutomaticEvents.execute();
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const data = await this.getAutomaticEventById.execute(id_event);
      if (!data) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const updated_by = req.session.user?.id;
      if (!updated_by) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const data = await this.updateAutomaticEvent.execute(id_event, {
        ...req.body,
        updated_by
      });

      if (!data) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const updated_by = req.session.user?.id;
      if (!updated_by) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const data = await this.activateAutomaticEvent.execute(id_event, updated_by);
      if (!data) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const updated_by = req.session.user?.id;
      if (!updated_by) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const data = await this.deactivateAutomaticEvent.execute(id_event, updated_by);
      if (!data) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async trigger(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const triggered_by = req.session.user?.id;
      if (!triggered_by) {
        return res.status(401).json({ error: 'No autenticado' });
      }

      const data = await this.triggerAutomaticEvent.execute(id_event, triggered_by);
      if (!data) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async listRuns(req: Request, res: Response, next: NextFunction) {
    try {
      const id_event = Number(req.params.id);
      if (Number.isNaN(id_event)) {
        return res.status(400).json({ error: 'ID invalido.' });
      }

      const exists = await this.getAutomaticEventById.execute(id_event);
      if (!exists) {
        return res.status(404).json({ error: 'Evento automatico no encontrado.' });
      }

      const data = await this.getAutomaticEventRuns.execute(id_event);
      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }
}
