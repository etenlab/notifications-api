import { Injectable, NotFoundException } from '@nestjs/common';
import { NewReactionInput } from './new-reaction.input';
import { Reaction } from './reaction.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  async create(data: NewReactionInput): Promise<Reaction> {
    const reaction = this.reactionRepository.create(data);
    return await this.reactionRepository.save(reaction);
  }

  async update(id: number, data: any, user_id: number): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOneOrFail({
      where: { id },
    });
    if (reaction && reaction.user_id === user_id) {
      await this.reactionRepository.update({ id }, data);
      return this.reactionRepository.findOneOrFail({ where: { id } });
    }
    throw new NotFoundException("You cannot update what you don't own...");
  }

  async findById(id: number): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOneOrFail({
      where: { id },
    });
    if (!reaction) {
      throw new NotFoundException('Not found');
    }
    return reaction;
  }

  async findReactionsByPostId(postId: number): Promise<Reaction[]> {
    const reactions = await this.reactionRepository.find({
      where: { post_id: postId },
    });
    if (!reactions) {
      throw new NotFoundException('Not found');
    }
    return reactions;
  }

  async delete(id: number): Promise<boolean> {
    await this.reactionRepository.delete({ id });
    return true;
  }
}
