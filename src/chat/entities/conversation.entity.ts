import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Conversation {
  @Field(() => [String])
  usersId: string[];

  @Field()
  _id: string;
}
