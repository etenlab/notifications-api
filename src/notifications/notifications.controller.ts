import {
  Controller,
  Delete,
  Inject,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, Ctx, Payload } from '@nestjs/microservices';
import {
  PgNotifyContext,
  PgNotifyEventPattern,
  PgNotifyMessagePattern,
  PgNotifyResponse,
} from 'nestjs-pg-notify';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { ExceptionFilter } from './notification.exception.filter';
import { LoggingInterceptor } from './notification.logging.interceptor';
import { NotificationToken } from './notification.token';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class NotificationsController {
  constructor(
    @Inject(NotificationToken.PgNotifyClient)
    private readonly client: ClientProxy,
  ) {}

  @PgNotifyEventPattern('post_changed')
  // @UsePipes(new ValidationPipe({ transform: true }))
  onUserCreated(
    @Payload() payload: any,
    @Ctx() context: PgNotifyContext,
  ): string {
    console.log(payload, context);
    return 'UserCreated: Ok';
  }

  // @PgNotifyMessagePattern({ event: 'removed', target: 'user' })
  // @UsePipes(new ValidationPipe({ transform: true }))
  // onUserRemoved(
  //   @Payload() payload: any,
  //   @Ctx() context: PgNotifyContext,
  // ): string {
  //   console.log(payload, context); =
  //   return 'UserRemoved: Ok';
  // }

  // @Post('user')
  // createUser(): Observable<PgNotifyResponse> {
  //   return this.client
  //     .send<PgNotifyResponse>('user:created', {
  //       userId: 1,
  //       date: new Date(),
  //     })
  //     .pipe(timeout(2000));
  // }

  // @Delete('user')
  // removeUser(): Observable<string> {
  //   return this.client.emit(
  //     { target: 'user', event: 'removed' },
  //     {
  //       userId: 2,
  //       date: new Date(),
  //     },
  //   );
  // }
}
