import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewDiscussionInput {
  @Field(() => Int, { nullable: true })
  app: number;

  @Field(() => Int, { nullable: true })
  org: number;

  @Field({ nullable: false })
  table_name: string;

  @Field(() => Int, { nullable: false })
  row: number;
}
