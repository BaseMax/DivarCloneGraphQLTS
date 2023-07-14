import { Document } from "mongoose";

export interface ConversationDocument extends Document {
  readonly usersId: string[];
  readonly postId : string
}
