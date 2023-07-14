import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import {
  CreateConversation,
  conversationSchema,
} from "./dto/create-conversation.input";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { ConversationDocument } from "./interfaces/conversation.document";
import { CreateMessageInput } from "./dto/create-message.input";
import { MessageDocument } from "./interfaces/message.document";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel("conversations")
    private conversationModel: Model<ConversationDocument>,
    @InjectModel("messages") private messageModel: Model<MessageDocument>
  ) {}

  async createConversation(usersId: string[], postId: string) {
    const alreadyExistConversation = await this.findConversationBetweenUsers(
      usersId
    );

    if (alreadyExistConversation && alreadyExistConversation.postId === postId)
      return alreadyExistConversation;

    const conversation = await this.conversationModel.create({
      usersId: usersId,
      postId: postId,
    });
    return conversation;
  }

  async findConversationBetweenUsers(
    usersId: string[]
  ): Promise<ConversationDocument> {
    return await this.conversationModel.findOne({
      usersId: { $all: usersId },
    });
  }

  async sendMessage(
    sendMessageDto: CreateMessageInput
  ): Promise<MessageDocument> {
    const isAllowed = await this.hasPermissionToModifyConversation(
      sendMessageDto.conversationId,
      sendMessageDto.senderId
    );

    if (!isAllowed) {
      throw new ForbiddenException("you don't have permission");
    }

    return await this.messageModel.create(sendMessageDto);
  }

  async findMessages(
    conversationId: string,
    userId: string
  ): Promise<MessageDocument[]> {
    const isAllowed = this.hasPermissionToModifyConversation(
      conversationId,
      userId
    );
    if (!isAllowed) {
      throw new ForbiddenException("you don't have permission");
    }

    return await this.messageModel
      .find({
        conversationId: conversationId,
      })
      .exec();
  }

  async findUserConversations(userId: string): Promise<ConversationDocument[]> {
    const conversations = await this.conversationModel.find({
      usersId: userId,
    });

    return conversations;
  }

  // update(id: number, updateChatInput: UpdateChatInput) {
  //   return `This action updates a #${id} chat`;
  // }

  async remove(messageId: string, userId: string): Promise<MessageDocument> {
    const isAllowedToDelete = this.hasPermissionToModifyMessage(
      messageId,
      userId
    );

    return this.messageModel.findOneAndDelete({ _id: messageId });
  }

  async removeConversation(
    conversationId: string,
    userId: string
  ): Promise<ConversationDocument> {
    const conversation = await this.validateConversationById(conversationId);

    const isAllowed = conversation.usersId.includes(userId);
    if (!isAllowed)
      throw new ForbiddenException(
        "you are not allowed to delete this conversation"
      );
    const deletedMessages = await this.messageModel.deleteMany({
      conversationId: conversationId,
    });

    return await this.conversationModel.findOneAndDelete({
      _id: conversationId,
    });
  }

  async validateConversationById(conversationId: string) {
    const existsConversation = await this.conversationModel.findById(
      conversationId
    );

    if (!existsConversation)
      throw new BadRequestException("you must first declare a conversation");

    return existsConversation;
  }

  async validateMessageById(messageId: string): Promise<MessageDocument> {
    const existingMessage = await this.messageModel.findById(messageId);

    if (!existingMessage)
      throw new BadRequestException(
        "message doesn't exist with this credentials"
      );

    return existingMessage;
  }

  async hasPermissionToModifyConversation(
    conversationId: string,
    userId: string
  ): Promise<boolean> {
    const conversation = await this.validateConversationById(conversationId);

    const isAllowed = conversation.usersId.includes(userId);

    return isAllowed;
  }

  async hasPermissionToModifyMessage(
    messageId: string,
    userId: string
  ): Promise<boolean> {
    const message = await this.validateMessageById(messageId);

    const isAllowed = message.senderId === userId ? true : false;

    return isAllowed;
  }
}
