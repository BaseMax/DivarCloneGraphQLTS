import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { IsEnum } from "class-validator";

export enum sortByEnum {
  category = "category",
  location = "location",
  price = "price",
}

registerEnumType(sortByEnum, { name: "sortByEnum" });

@InputType()
export class Sort {
  @Field(() => sortByEnum)
  @IsEnum(sortByEnum)
  filed: sortByEnum;
}
