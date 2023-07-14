import { Document } from "mongoose";

export interface PostDocument extends Document {
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly location: string;
  readonly imagesUrl: string[];
  readonly authorId: string;
}
