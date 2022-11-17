import {
  Controller,
  Inject,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { PgNotifyEventPattern } from 'nestjs-pg-notify';
import { ExceptionFilter } from './notification.exception.filter';
import { LoggingInterceptor } from './notification.logging.interceptor';
import { NotificationToken } from './notification.token';
import { NotificationsService } from './notifications.service';

import { DiscussionDto, NotificationDto, PostDto, ReactionDto } from './dto';

@Controller()
@UseFilters(ExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class NotificationsController {
  constructor(
    @Inject(NotificationToken.PgNotifyClient)
    private readonly client: ClientProxy,
    private readonly notificationsService: NotificationsService,
  ) {}

  @PgNotifyEventPattern('discussion_created')
  @UsePipes(new ValidationPipe({ transform: true }))
  onDiscussionCreated(@Payload() payload: DiscussionDto): void {
    this.notificationsService.generateDiscussionCreatedNotifications(payload);
  }

  @PgNotifyEventPattern('post_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  onPostChanged(@Payload() payload: PostDto): void {
    this.notificationsService.generatePostChangedNotifications(payload);
  }

  @PgNotifyEventPattern('reaction_changed')
  @UsePipes(new ValidationPipe({ transform: true }))
  onReactionChanged(@Payload() payload: ReactionDto): void {
    this.notificationsService.generateReactionChangedNotifications(payload);
  }

  @PgNotifyEventPattern('notification_created')
  @UsePipes(new ValidationPipe({ transform: true }))
  onNotificationCreated(@Payload() payload: NotificationDto): void {
    this.notificationsService.listenNofity(payload.record);
  }
}
