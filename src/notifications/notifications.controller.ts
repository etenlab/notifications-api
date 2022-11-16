import {
  Controller,
  Inject,
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

import { DiscussionDto, PostDto, ReactionDto } from './dto';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class NotificationsController {
  constructor(
    @Inject(NotificationToken.PgNotifyClient)
    private readonly client: ClientProxy,
  ) {}

  @PgNotifyEventPattern('discussion_created')
  @UsePipes(new ValidationPipe({ transform: true }))
  onDiscussionCreated(
    @Payload() payload: DiscussionDto,
    @Ctx() context: PgNotifyContext,
  ): string {
    console.log(payload, context);
    return 'UserCreated: Ok';
  }

  @PgNotifyEventPattern('post_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  onPostChanged(
    @Payload() payload: PostDto,
    @Ctx() context: PgNotifyContext,
  ): string {
    console.log(payload, context);
    return 'UserCreated: Ok';
  }

  @PgNotifyEventPattern('reaction_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  onReactionChanged(
    @Payload() payload: ReactionDto,
    @Ctx() context: PgNotifyContext,
  ): string {
    console.log(payload, context);
    return 'UserCreated: Ok';
  }
}
