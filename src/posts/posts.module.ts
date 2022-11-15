import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { DiscussionsService } from 'src/discussions/discussions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.model';
import { Discussion } from 'src/discussions/discussion.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Discussion]),
  ],
  providers: [PostsResolver, PostsService, DiscussionsService],
})
export class PostsModule {}
