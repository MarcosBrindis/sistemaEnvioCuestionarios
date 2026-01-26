import { MysqlSenderRepository } from './database/mysql/MysqlSenderRepository';
import { LocalEmailQueue } from './queue/LocalEmailQueue';
import { SmartBalancerService } from '../application/service/SmartBalancerService';
import { NodemailerService } from './service/NodemailerService';
import { EnqueueEmailUseCase } from '../application/usecase/EnqueueEmailUseCase';
import { ProcessEmailUseCase } from '../application/usecase/ProcessEmailUseCase';
import { SendEmailController } from './http/controller/SendEmailController';

const senderRepository = new MysqlSenderRepository();
const smartBalancer = new SmartBalancerService(senderRepository);
const mailerService = new NodemailerService();
const emailQueue = new LocalEmailQueue();

export const processEmailUseCase = new ProcessEmailUseCase(smartBalancer, mailerService, senderRepository);
emailQueue.registerWorker((job) => processEmailUseCase.execute(job));

export const enqueueEmailUseCase = new EnqueueEmailUseCase(emailQueue);
export const sendEmailController = new SendEmailController(enqueueEmailUseCase);
