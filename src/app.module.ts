import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ProjectsModule } from './projects/projects.module';
import { RpcValidationFilter } from './exceptions-filters/rpc-validation.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProjectsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        //url: configService.get<string>('PG_DATABASE_CONNECTION_URL'),
        host: configService.get<string>('PG_DATABASE_HOST'), // Адрес сервера базы
        port: configService.get<number>('PG_DATABASE_PORT'), // Порт
        username: configService.get<string>('PG_DATABASE_USERNAME'), // Имя пользователя
        password: configService.get<string>('PG_DATABASE_PASSWORD'), // Пароль
        database: configService.get<string>('PG_DATABASE_NAME'), // Имя базы данных
        autoLoadEntities: true,
        synchronize: true,
        extra: { ssl: { rejectUnauthorized: false } },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: RpcValidationFilter,
    },
  ],
})
export class AppModule {}
