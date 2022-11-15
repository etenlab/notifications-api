import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewReactionInput {
  @Field(() => Int, { nullable: false })
  post_id: number;

  @Field(() => String, { nullable: false })
  user_id: string;

  @Field(() => String, { nullable: false })
  content: string;
}
