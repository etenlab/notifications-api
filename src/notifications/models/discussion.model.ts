import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from 'src/notifications/models/post.model';

@Entity(`discussions`, {
  schema: 'admin',
})
@Directive('@key(fields: "id")')
@ObjectType()
export class Discussion {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ default: 0 })
  @Field(() => Int)
  app: number;

  @Column({ default: 0 })
  @Field(() => Int)
  org: number;

  @Column()
  @Field()
  table_name: string;

  @Column()
  @Field(() => Int)
  row: number;

  @Field(() => [Post], { nullable: 'items' })
  @OneToMany(() => Post, (post) => post.discussion)
  posts: Post[];
}
