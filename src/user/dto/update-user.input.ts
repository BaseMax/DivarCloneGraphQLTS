import { InputType, Field, Int, PartialType } from "@nestjs/graphql";
import { SignupInput } from "src/auth/dto/signup.dto";

@InputType()
export class UpdateUserInput extends PartialType(SignupInput) {}
