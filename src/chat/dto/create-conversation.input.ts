import { InputType, Int, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsString } from "class-validator";

@InputType()
@Schema()
export class CreateConversation {
  @Field(() => String)
  @IsString()
  userId: string;

  @Field()
  @IsString()
  @Prop()
  postId: string;

  @Prop({ type: [{ type: String }] })
  usersId: string[];
}

export const conversationSchema =
  SchemaFactory.createForClass(CreateConversation);
