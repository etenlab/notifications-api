import {
  Controller,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Ctx, Payload } from '@nestjs/microservices';
import {
  PgNotifyContext,
  PgNotifyEventPattern,
  PgNotifyMessagePattern,
} from 'nestjs-pg-notify';
import { ExceptionFilter } from './app.exception.filter';

@Controller()
@UseFilters(ExceptionFilter)
export class AppController {
  @PgNotifyEventPattern('user:created')
  @UsePipes(new ValidationPipe({ transform: true }))
  onUserCreated(
    @Payload() payload: AppUserCreatedDto,
    @Ctx() context: PgNotifyContext,
  ): string {
    return 'UserCreated: Ok';
  }

  @PgNotifyMessagePattern({ event: 'removed', target: 'user' })
  @UsePipes(new ValidationPipe({ transform: true }))
  onUserRemoved(
    @Payload() payload: AppUserRemovedDto,
    @Ctx() context: PgNotifyContext,
  ): string {
    return 'UserRemoved: Ok';
  }
}
