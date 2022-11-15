import { NotFoundException, Injectable, Inject } from '@nestjs/common';
import {
  Args,
  Int,
  Subscription,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { Discussion } from 'src/discussions/discussion.model';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { DiscussionsService } from 'src/discussions/discussions.service';
import { NewPostInput } from './new-post.input';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';

@Resolver(() => Post)
@Injectable()
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly discussionsService: DiscussionsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Post)
  async post(@Args('id') id: number): Promise<Post> {
    const post = await this.postsService.findPostById(id);
    if (!post) {
      throw new NotFoundException(id);
    }
    return post;
  }

  @Query(() => [Post])
  async postsByDiscussionId(
    @Args('discussionId', { type: () => Int }) discussionId: number,
  ): Promise<Post[]> {
    const posts = await this.postsService.findPostsByDiscussionId(discussionId);
    if (!posts) {
      return [];
    }
    return posts;
  }

  @Mutation(() => Post)
  async createPost(
    @Args('newPostData') newPostData: NewPostInput,
  ): Promise<Post> {
    const { id } = await this.postsService.create(newPostData);
    const post = await this.postsService.findPostById(id);
    if (!post) {
      throw new NotFoundException(id);
    }
    this.pubSub.publish('postCreated', { postCreated: post });
    return post;
  }

  @Subscription(() => Post)
  async postCreated() {
    return this.pubSub.asyncIterator('postCreated');
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: number,
    @Args('data') data: NewPostInput,
    @Args('userId') userId: string,
  ): Promise<Post> {
    const post = await this.postsService.update(id, data, userId);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Args('id', { type: () => Int }) id: number) {
    const isDeleted = await this.postsService.delete(id);
    if (isDeleted) {
      this.pubSub.publish('postDeleted', { postDeleted: id });
    }
    return isDeleted;
  }

  @Subscription(() => Int)
  async postDeleted() {
    return this.pubSub.asyncIterator('postDeleted');
  }

  @Mutation(() => Boolean)
  async deletePostsByDiscussionId(
    @Args('discussionId', { type: () => Int }) discussionId: number,
  ) {
    return this.postsService.deletePostsByDiscussionId(discussionId);
  }

  @ResolveField('discussion', () => Discussion)
  async getDiscussion(@Parent() post: Post) {
    const discussion = await this.discussionsService.findOneById(
      post.discussion_id,
    );
    return discussion;
  }
}
