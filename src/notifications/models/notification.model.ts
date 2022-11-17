import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity(`notifications`, {
  schema: `admin`,
})
@ObjectType()
export class Notification {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  user_id: number;

  @Column()
  @Field(() => String)
  table_name: string;

  @Column()
  @Field(() => Int)
  row: number;

  @Column({ default: false })
  @Field(() => Boolean)
  acknowledged: boolean;

  @Column()
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date;
}
