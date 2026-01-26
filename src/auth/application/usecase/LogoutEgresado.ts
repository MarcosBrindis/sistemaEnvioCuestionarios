export class LogoutEgresado {
  async execute(req: any): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}
