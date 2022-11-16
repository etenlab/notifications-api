import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { PgNotifyServer } from 'nestjs-pg-notify';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

(async (): Promise<void> => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      strategy: new PgNotifyServer({
        connection: {
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          database: process.env.DB_DATABASE,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        },
        strategy: {
          retryInterval: 1_000,
          retryTimeout: Infinity,
        },
      }),
    },
  );

  await app.listen();
})();
