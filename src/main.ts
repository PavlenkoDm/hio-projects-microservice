import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QueueNames } from './queue/constants/queue.constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
      queue: QueueNames.AUTH,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_CONNECTION_URL')],
      queue: QueueNames.PROJECTS,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
      forbidUnknownValues: true,
      stopAtFirstError: true,
    }),
  );

  await app.startAllMicroservices();

  await app.listen(configService.get<number>('PORT'), () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `Hio-API-Gateway start on port: ${configService.get<number>('PORT')}`,
    );
  });
}

bootstrap();
