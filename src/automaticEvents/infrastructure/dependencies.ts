import { dispatchBirthdayCongratsUseCase, dispatchSurveyRemindersUseCase } from '../../distribution/infrastructure/dependencies';
import { ActivateAutomaticEvent } from '../application/usecase/ActivateAutomaticEvent';
import { CreateAutomaticEvent } from '../application/usecase/CreateAutomaticEvent';
import { DeactivateAutomaticEvent } from '../application/usecase/DeactivateAutomaticEvent';
import { GetAutomaticEventById } from '../application/usecase/GetAutomaticEventById';
import { GetAutomaticEventRuns } from '../application/usecase/GetAutomaticEventRuns';
import { GetAutomaticEvents } from '../application/usecase/GetAutomaticEvents';
import { TriggerAutomaticEvent } from '../application/usecase/TriggerAutomaticEvent';
import { UpdateAutomaticEvent } from '../application/usecase/UpdateAutomaticEvent';
import { MysqlAutomaticEventRepository } from './database/mysql/MysqlAutomaticEventRepository';
import { DistributionAutomaticEventExecutor } from './execution/DistributionAutomaticEventExecutor';
import { AutomaticEventsController } from './http/controller/AutomaticEventsController';

const automaticEventRepository = new MysqlAutomaticEventRepository();
const automaticEventExecutor = new DistributionAutomaticEventExecutor(
  dispatchBirthdayCongratsUseCase,
  dispatchSurveyRemindersUseCase
);

const createAutomaticEvent = new CreateAutomaticEvent(automaticEventRepository);
const getAutomaticEvents = new GetAutomaticEvents(automaticEventRepository);
const getAutomaticEventById = new GetAutomaticEventById(automaticEventRepository);
const updateAutomaticEvent = new UpdateAutomaticEvent(automaticEventRepository);
const activateAutomaticEvent = new ActivateAutomaticEvent(automaticEventRepository);
const deactivateAutomaticEvent = new DeactivateAutomaticEvent(automaticEventRepository);
const triggerAutomaticEvent = new TriggerAutomaticEvent(automaticEventRepository, automaticEventExecutor);
const getAutomaticEventRuns = new GetAutomaticEventRuns(automaticEventRepository);

export const automaticEventsController = new AutomaticEventsController(
  createAutomaticEvent,
  getAutomaticEvents,
  getAutomaticEventById,
  updateAutomaticEvent,
  activateAutomaticEvent,
  deactivateAutomaticEvent,
  triggerAutomaticEvent,
  getAutomaticEventRuns
);
