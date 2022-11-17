import { Injectable } from '@nestjs/common';
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

  async generateDiscussionCreatedNotifications(
    payload: DiscussionDto,
  ): Promise<void> {
    const { operation, record } = payload;
    const content = {
      type: 'DISCUSSION',
      operation,
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

  async generatePostChangedNotifications(payload: PostDto): Promise<void> {
    const { operation, record } = payload;
    const content = {
      type: 'POST',
      operation,
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

    const users = await this.postRepository.find({
      select: {
        user_id: true,
      },
      where: {
        discussion_id: record.discussion_id,
      },
    });

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

  async generateReactionChangedNotifications(payload: ReactionDto) {
    const { operation, record } = payload;
    const content = {
      type: 'REACTION',
      operation,
      summary: record.content,
    };
    const {
      discussion: { table_name, row },
    } = await this.postRepository.findOne({
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

    const users = await this.postRepository.find({
      select: {
        user_id: true,
      },
      where: {
        id: record.post_id,
      },
    });

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
}
