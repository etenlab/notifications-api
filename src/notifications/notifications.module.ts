import { Module } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PgNotifyClient } from 'nestjs-pg-notify';
import { Notification, Discussion, Reaction, Post, User } from './models';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsController } from './notifications.controller';
import { NotificationToken } from '../token';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { NotificationsService } from './notifications.service';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Discussion, Post, Reaction, User]),
  ],
  controllers: [NotificationsController],
  providers: [
    {
      provide: NotificationToken.PgNotifyClient,
      useFactory: (): ClientProxy =>
        new PgNotifyClient({
          connection: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
          },
          strategy: {
            retryInterval: 1_000,
            retryTimeout: Infinity,
          },
        }),
    },
    NotificationsResolver,
    NotificationsService,
  ],
  exports: [NotificationToken.PgNotifyClient],
})
export class NotificationsModule {}
