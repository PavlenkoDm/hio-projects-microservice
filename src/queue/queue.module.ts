import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueClientsNames, QueueNames } from './constants/queue.constants';
import { ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QueueClientsNames.AUTH_QUEUE_CLIENT,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService): Promise<object> => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
            queue: QueueNames.AUTH,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
