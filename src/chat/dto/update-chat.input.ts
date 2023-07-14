import { CreateConversation } from "./create-conversation.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateChatInput extends PartialType(CreateConversation) {
  @Field(() => Int)
  id: number;
}
