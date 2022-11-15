import { Module } from '@nestjs/common';
import { DiscussionsResolver } from './discussions.resolver';
import { DiscussionsService } from './discussions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './discussion.model';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion])],
  providers: [DiscussionsResolver, DiscussionsService],
})
export class DiscussionsModule {}
