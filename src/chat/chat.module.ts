import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatResolver } from "./chat.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { conversationSchema } from "./dto/create-conversation.input";
import { MessageSchema } from "./dto/create-message.input";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "conversations", schema: conversationSchema },
      { name: "messages", schema: MessageSchema },
    ]),
    AuthModule
  ],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}
