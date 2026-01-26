import { SessionData } from '../../domain/model/session';

export class GetSessionInfo {
  async execute(req: any): Promise<SessionData> {
    if (req.session && req.session.user) {
      return {
        authenticated: true,
        user: req.session.user,
      };
    }
    return {
      authenticated: false,
      user: null,
    } as any;
  }
}
