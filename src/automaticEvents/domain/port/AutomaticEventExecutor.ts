import { AutomaticEvent } from '../model/AutomaticEvent';

export interface AutomaticEventExecutor {
  execute(event: AutomaticEvent): Promise<unknown>;
}
