import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewPostInput {
  @Field(() => Int)
  discussion_id: number;

  @Field(() => Int, { nullable: false })
  user_id: number;

  @Field(() => String)
  quill_text: string;

  @Field(() => String)
  plain_text: string;

  @Field(() => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;
}
