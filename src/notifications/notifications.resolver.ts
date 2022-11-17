import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Query,
  Subscription,
  Args,
  Int,
  Mutation,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';
import { Notification } from './models/notification.model';
import { NotificationsService } from './notifications.service';
import { NotificationToken } from './notification.token';

@Resolver(() => Notification)
@Injectable()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [Notification])
  async notifications(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Notification[]> {
    const notifications = await this.notificationsService.findByUserId(userId);
    if (!notifications) {
      return [];
    }
    return notifications;
  }

  @Mutation(() => Notification)
  async acknowledgedNotification(@Args('id', { type: () => Int }) id: number) {
    const notification =
      await this.notificationsService.acknowledgedNotification(id);
    if (!notification) {
      throw new NotFoundException(`Not found notification by #${id}`);
    }
    return notification;
  }

  @Mutation(() => Boolean)
  async deleteNotification(@Args('id', { type: () => Int }) id: number) {
    const isDeleted = await this.notificationsService.delete(id);
    return isDeleted;
  }

  @Mutation(() => Boolean)
  async deleteNotificationsByUserId(
    @Args('userId', { type: () => Int }) userId: number,
  ) {
    const isDeleted = await this.notificationsService.deleteByUserId(userId);
    return isDeleted;
  }

  @Subscription(() => Notification, {
    name: 'NotificationToken.NotificationAdded',
    filter: (payload, variables) => {
      // console.log(payload, variables);
      return payload.notificationAdded.user_id === variables._userId;
    },
  })
  async subscribeNotificationAdded(@Args('userId') _userId: number) {
    return this.pubSub.asyncIterator(NotificationToken.NotificationAdded);
  }
}
