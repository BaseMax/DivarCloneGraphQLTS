import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ChatService } from "./chat.service";
import { Conversation } from "./entities/conversation.entity";
import { CreateConversation } from "./dto/create-conversation.input";
import { UpdateChatInput } from "./dto/update-chat.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { GetCurrentUserId } from "src/decorators/get.current.userId";
import { CreateMessageInput } from "./dto/create-message.input";
import { Message } from "./entities/message.entity";

@Resolver(() => Conversation)
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Conversation)
  createConversation(
    @Args("createConversation") createConversationDto: CreateConversation,
    @GetCurrentUserId() userId: string
  ) {
    const usersId = [
      createConversationDto.userId,
      createConversationDto.postId,
    ];
    return this.chatService.createConversation(
      usersId,
      createConversationDto.postId
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message, { name: "sendMessage" })
  sendMessage(
    @Args("sendMessage") createMessageDto: CreateMessageInput,
    @GetCurrentUserId() userId: string
  ) {
    return this.chatService.sendMessage({
      ...createMessageDto,
      senderId: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Conversation], { name: "findUserAllConversation" })
  findUserAllConversation(@GetCurrentUserId() userId: string) {
    return this.chatService.findUserConversations(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Message], { name: "findMessages" })
  findMessages(
    @Args("conversationId") conversationId: string,
    @GetCurrentUserId() userId: string
  ) {
    return this.chatService.findMessages(conversationId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Conversation)
  removeConversation(
    @Args("conversationId", { type: () => String }) conversationId: string,
    @GetCurrentUserId() userId: string
  ) {
    return this.chatService.removeConversation(conversationId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message)
  removeMessage(
    @Args("messageId", { type: () => String }) messageId: string,
    @GetCurrentUserId() userId: string
  ) {
    return this.chatService.remove(messageId, userId);
  }
}
