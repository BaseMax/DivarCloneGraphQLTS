import { InputType, Int, Field } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsPhoneNumber, IsString } from "class-validator";

@InputType()
@Schema()
export class SignupInput {
  @Field()
  @Prop({ unique: true })
  @IsPhoneNumber()
  phoneNumber: string;

  @Field()
  @Prop()
  @IsString()
  name: string;

  @Field()
  @Prop()
  @IsString()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(SignupInput);
