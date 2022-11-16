import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewReactionInput {
  @Field(() => Int, { nullable: false })
  post_id: number;

  @Field(() => Int, { nullable: false })
  user_id: number;

  @Field(() => String, { nullable: false })
  content: string;
}
