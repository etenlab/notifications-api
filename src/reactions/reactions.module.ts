import { Module } from '@nestjs/common';
import { ReactionsResolver } from './reactions.resolver';
import { ReactionsService } from './reactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './reaction.model';
import { Post } from 'src/posts/post.model';
import { PostsService } from 'src/posts/posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reaction]),
    TypeOrmModule.forFeature([Post]),
  ],
  providers: [ReactionsResolver, ReactionsService, PostsService],
})
export class ReactionsModule {}
