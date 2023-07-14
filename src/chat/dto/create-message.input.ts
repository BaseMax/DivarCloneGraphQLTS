import { Field, InputType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsString } from "class-validator";

@InputType()
@Schema()
export class CreateMessageInput {
  @Field()
  @IsString()
  @Prop()
  conversationId: string;

  @Field()
  @IsString()
  @Prop()
  content: string;

  @Prop()
  senderId: string;
}

export const MessageSchema = SchemaFactory.createForClass(CreateMessageInput);
