import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Message {
  @Field()
  _id: string;

  @Field()
  content: string;

  @Field()
  senderId: string;
}
