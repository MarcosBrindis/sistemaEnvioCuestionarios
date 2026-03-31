import * as cron from 'node-cron';
import { DispatchBirthdayCongratsUseCase } from '../../application/usecase/DispatchBirthdayCongratsUseCase';

export function scheduleBirthdayDispatchJob(useCase: DispatchBirthdayCongratsUseCase): void {
  const enabled = (process.env.BIRTHDAY_CRON_ENABLED || 'false').toLowerCase() === 'true';
  if (!enabled) {
    console.log('Birthday cron deshabilitado (BIRTHDAY_CRON_ENABLED=false).');
    return;
  }

  const expression = process.env.BIRTHDAY_CRON_EXPRESSION || '0 9 * * *';
  const timezone = process.env.BIRTHDAY_CRON_TIMEZONE || 'America/Mexico_City';
  const templateId = Number(process.env.BIRTHDAY_TEMPLATE_ID || '0');

  if (!templateId || Number.isNaN(templateId)) {
    throw new Error('BIRTHDAY_TEMPLATE_ID debe estar configurado para activar el cron de cumpleaños.');
  }

  if (!cron.validate(expression)) {
    throw new Error(`Expresion cron invalida para cumpleaños: ${expression}`);
  }

  let isRunning = false;

  cron.schedule(
    expression,
    async () => {
      if (isRunning) {
        console.log('Birthday cron omitido: ya existe una ejecucion en curso.');
        return;
      }

      isRunning = true;
      try {
        const result = await useCase.execute({ id_template: templateId });
        console.log('Resultado birthday cron:', result);
      } catch (error) {
        console.error('Error en birthday cron:', error);
      } finally {
        isRunning = false;
      }
    },
    { timezone }
  );

  console.log(`Birthday cron programado con expresion "${expression}" en zona horaria "${timezone}".`);
}
