import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class NewPostInput {
  @Field(() => Int)
  discussion_id: number;

  @Field(() => String, { nullable: false })
  user_id: string;

  @Field(() => String)
  quill_text: string;

  @Field(() => String)
  plain_text: string;

  @Field(() => String, { nullable: false, defaultValue: 'simple' })
  postgres_language: string;
}
