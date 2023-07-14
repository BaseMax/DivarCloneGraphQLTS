import { Document } from "mongoose";

export interface MessageDocument extends Document {
  readonly conversationId: string;

  readonly content: string;

  readonly senderId: string;
}
