import { Directive, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Discussion } from 'src/notifications/models/discussion.model';
import { Reaction } from 'src/notifications/models/reaction.model';

@Entity(`posts`, {
  schema: `admin`,
})
@ObjectType()
@Directive('@key(fields: "id")')
export class Post {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field(() => Discussion)
  @ManyToOne(() => Discussion, (discussion) => discussion.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'discussion_id' })
  discussion: Discussion;

  @Field(() => [Reaction], { nullable: 'items' })
  @OneToMany(() => Reaction, (reaction) => reaction.post)
  reactions: Reaction[];

  @Column()
  discussion_id: number;

  @Column()
  @Field(() => Int)
  user_id: number;

  @Column()
  @Field(() => String)
  quill_text: string;

  @Column()
  @Field(() => String)
  plain_text: string;

  @Column()
  @Field(() => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;
}
