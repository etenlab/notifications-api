import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiscussionDto, PostDto, ReactionDto } from './dto';
import { Discussion, Notification, Post, Reaction, User } from './models';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Whenever we found changes in Discussion Table, this function is called by conroller,
  // and create a new Notification.
  async generateDiscussionCreatedNotifications(
    payload: DiscussionDto,
  ): Promise<void> {
    const { operation, record } = payload;
    const content = {
      type: 'DISCUSSION',
      operation,
      operator: '',
      summary: '',
    };
    const users = await this.userRepository.find({
      select: {
        user_id: true,
      },
    });

    await this.notificationRepository
      .createQueryBuilder()
      .insert()
      .into(Notification)
      .values(
        users.map(({ user_id }) => ({
          user_id,
          table_name: record.table_name,
          row: record.row,
          content: JSON.stringify(content),
        })),
      )
      .execute();
  }

  // Whenever we found changes in Post Table, this function is called by conroller,
  // and create a new Notification.
  async generatePostChangedNotifications(payload: PostDto): Promise<void> {
    const { operation, record } = payload;
    const content = {
      type: 'POST',
      operation,
      operator: record.user_id,
      summary: record.plain_text,
    };
    const { table_name, row } = await this.discussionRepository.findOne({
      select: {
        table_name: true,
        row: true,
      },
      where: {
        id: record.discussion_id,
      },
    });

    const users = await this.postRepository
      .createQueryBuilder('admin.posts')
      .select('DISTINCT(user_id)')
      .where('discussion_id = :discussionId', {
        discussionId: record.discussion_id,
      })
      .andWhere('user_id != :userId', {
        userId: record.user_id,
      })
      .execute();

    await this.notificationRepository
      .createQueryBuilder()
      .insert()
      .into(Notification)
      .values(
        users.map(({ user_id }) => ({
          user_id,
          table_name: table_name,
          row: row,
          content: JSON.stringify(content),
        })),
      )
      .execute();
  }

  // Whenever we found changes in Reaction Table, this function is called by conroller,
  // and create a new Notification.
  async generateReactionChangedNotifications(
    payload: ReactionDto,
  ): Promise<void> {
    const { operation, record } = payload;
    const content = {
      type: 'REACTION',
      operation,
      operator: record.user_id,
      summary: record.content,
    };
    const post = await this.postRepository.findOne({
      relations: {
        discussion: true,
      },
      select: {
        discussion: {
          table_name: true,
          row: true,
        },
      },
      where: {
        id: record.post_id,
      },
    });

    if (!post) {
      return;
    }

    const {
      discussion: { table_name, row },
    } = post;

    const users = await this.postRepository
      .createQueryBuilder('admin.posts')
      .select('DISTINCT(user_id)')
      .where('id = :postId', {
        postId: record.post_id,
      })
      .andWhere('user_id != :userId', {
        userId: record.user_id,
      })
      .execute();

    await this.notificationRepository
      .createQueryBuilder()
      .insert()
      .into(Notification)
      .values(
        users.map(({ user_id }) => ({
          user_id,
          table_name: table_name,
          row: row,
          content: JSON.stringify(content),
        })),
      )
      .execute();
  }

  async findByUserId(userId: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.find({
      where: { user_id: userId },
    });
    if (!notifications) {
      throw new NotFoundException(
        `Notifications not found by user_id#${userId}`,
      );
    }
    return notifications;
  }

  async acknowledgedNotification(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOneOrFail({
      where: { id },
    });
    if (notification && notification.id === id) {
      await this.notificationRepository.update({ id }, { acknowledged: true });
      return await this.notificationRepository.findOneOrFail({ where: { id } });
    }
    throw new NotFoundException("You cannot update what you don't own...");
  }

  async setAcknowledgedNotificationsByUserId(userId: number): Promise<boolean> {
    await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ acknowledged: true })
      .where('user_id = :userId', {
        userId,
      })
      .andWhere('acknowledged = :acknowledged', {
        acknowledged: false,
      })
      .execute();

    return true;
  }

  async delete(id: number): Promise<boolean> {
    await this.notificationRepository.delete({ id });
    return true;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    await this.notificationRepository.delete({ user_id: userId });
    return true;
  }
}
