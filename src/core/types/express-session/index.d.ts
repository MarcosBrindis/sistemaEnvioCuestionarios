import 'express-session';
import { SessionUser } from '../../../auth/domain/model/session';

declare module 'express-session' {
  interface SessionData {
    user?: SessionUser;
  }
}
