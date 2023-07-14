import { InputType, Int, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ArrayMinSize, IsArray, IsNumber, IsString } from "class-validator";

@Schema()
@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @Prop()
  title: string;

  @Field()
  @IsString()
  @Prop()
  description: string;

  @Field()
  @IsString()
  @Prop()
  category: string;

  @Field()
  @IsNumber()
  @Prop({ type: Number })
  price: number;

  @Field()
  @IsString()
  @Prop()
  location: string;

  @Field(() => [String])
  @ArrayMinSize(1, { message: "At least one value is required" })
  @IsString({ each: true, message: "all values must be string" })
  @Prop({ type: [{ type: String }] })
  imagesUrl: string[];

  @Prop()
  authorId: string;
}

export const PostSchema = SchemaFactory.createForClass(CreatePostInput);
