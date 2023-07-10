import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";



@ObjectType()
export class Auth {
  @Field()
  token: string;

  @Field()
  name: string;

}

 