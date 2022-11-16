import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.model';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [],
})
export class PostsModule {}
