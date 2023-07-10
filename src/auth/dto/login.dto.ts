import { IsPhoneNumber, IsString } from "class-validator";
import { SignupInput } from "./signup.dto";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class LoginInput {
  @Field()
  @IsPhoneNumber()
  phoneNumber: string;

  @Field()
  @IsString()
  password: string;
}
