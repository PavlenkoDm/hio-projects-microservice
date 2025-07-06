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
        url: configService.get<string>('PG_DATABASE_CONNECTION_URL'),
        //*host: 'localhost', // Адрес сервера базы
        //port: 5432, // Порт
        //username: 'your_username', // Имя пользователя
        //password: 'your_password', // Пароль
        //database: 'your_database', // Имя базы данных
        autoLoadEntities: true,
        synchronize: true,
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
