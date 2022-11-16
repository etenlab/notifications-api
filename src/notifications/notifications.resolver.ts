import { Injectable, Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';
import { Notification } from './notification.model';
import { NotificationsService } from './notifications.service';

@Resolver(() => Notification)
@Injectable()
export class NotificationsResolver {
  constructor(
    private readonly notificationsService: NotificationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Boolean)
  async discussion(): Promise<boolean> {
    return true;
  }

  // @Query(() => [Discussion])
  // async discussions(
  //   @Args('table_name') table_name: string,
  //   @Args('row', { type: () => Int }) row: number,
  // ): Promise<Discussion[]> {
  //   const discussions = await this.discussionsService.findByTableNameAndRow(
  //     table_name,
  //     row,
  //   );
  //   if (!discussions) {
  //     return [];
  //   }
  //   return discussions;
  // }

  // @Mutation(() => Discussion)
  // async createDiscussion(
  //   @Args('newDiscussionData') newDiscussionData: NewDiscussionInput,
  // ): Promise<Discussion> {
  //   const { id } = await this.discussionsService.create(newDiscussionData);
  //   const discussion = await this.discussionsService.findOneById(id);
  //   if (!discussion) {
  //     throw new NotFoundException(id);
  //   }
  //   this.pubSub.publish('discussionCreated', { discussionCreated: discussion });
  //   return discussion;
  // }

  // @Subscription(() => Discussion)
  // async discussionCreated() {
  //   return this.pubSub.asyncIterator('discussionCreated');
  // }

  // @Mutation(() => Boolean)
  // async deleteDiscussion(@Args('id', { type: () => Int }) id: number) {
  //   return this.discussionsService.delete(id);
  // }
}
