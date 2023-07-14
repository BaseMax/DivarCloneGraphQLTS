import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Post {
  @Field()
  _id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  location: string;

  @Field(() => [String])
  imagesUrl: string[];

  @Field()
  category: string;

  @Field()
  authorId: string;
}
