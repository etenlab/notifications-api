import { Injectable, NotFoundException } from '@nestjs/common';
import { NewDiscussionInput } from './new-discussion.input';
import { Discussion } from './discussion.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepository: Repository<Discussion>,
  ) {}

  async create(data: NewDiscussionInput): Promise<Discussion> {
    const discussion = this.discussionRepository.create(data);
    return await this.discussionRepository.save(discussion);
  }

  async findOneById(discussionId: number): Promise<Discussion> {
    const discussion = this.discussionRepository.findOne({
      relations: ['posts', 'posts.reactions'],
      where: { id: discussionId },
    });
    if (!discussion) {
      throw new NotFoundException(`Discussion #${discussionId} not found`);
    }
    return discussion;
  }

  async findByTableNameAndRow(
    table_name: string,
    row: number,
  ): Promise<Discussion[]> {
    const discussions = this.discussionRepository.find({
      relations: ['posts', 'posts.reactions'],
      where: { table_name, row },
    });
    if (!discussions) {
      throw new NotFoundException(
        `Discussion not found by table name#${table_name}, row#${row}`,
      );
    }
    return discussions;
  }

  async delete(id: number): Promise<boolean> {
    await this.discussionRepository.delete({ id });
    return true;
  }
}
