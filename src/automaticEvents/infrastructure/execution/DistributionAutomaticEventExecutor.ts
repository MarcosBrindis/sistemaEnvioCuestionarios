import {
  BirthdayDispatchPayload,
  SurveyDispatchPayload
} from '../../domain/model/AutomaticEvent';
import { AutomaticEventExecutor } from '../../domain/port/AutomaticEventExecutor';
import { DispatchBirthdayCongratsUseCase } from '../../../distribution/application/usecase/DispatchBirthdayCongratsUseCase';
import { DispatchSurveyRemindersUseCase } from '../../../distribution/application/usecase/DispatchSurveyRemindersUseCase';

export class DistributionAutomaticEventExecutor implements AutomaticEventExecutor {
  constructor(
    private readonly birthdayDispatchUseCase: DispatchBirthdayCongratsUseCase,
    private readonly surveyDispatchUseCase: DispatchSurveyRemindersUseCase
  ) {}

  async execute(event: {
    event_type: 'birthday_dispatch' | 'survey_dispatch';
    payload: BirthdayDispatchPayload | SurveyDispatchPayload;
  }): Promise<unknown> {
    if (event.event_type === 'birthday_dispatch') {
      const payload = event.payload as BirthdayDispatchPayload;
      const referenceDate = payload.reference_date ? new Date(payload.reference_date) : undefined;

      return this.birthdayDispatchUseCase.execute({
        id_template: payload.id_template,
        referenceDate
      });
    }

    const payload = event.payload as SurveyDispatchPayload;
    return this.surveyDispatchUseCase.execute({
      id_encuesta: payload.id_encuesta,
      id_template: payload.id_template,
      filtro: payload.filtro,
      id_group: payload.id_group
    });
  }
}
