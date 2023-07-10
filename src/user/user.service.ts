import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { UpdateUserInput } from "./dto/update-user.input";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "src/user/interface/user.document";
import { Model } from "mongoose";

@Injectable()
export class UserService {
  constructor(@InjectModel("users") private userModel: Model<UserDocument>) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async findByPhoneNumberOrThrow(phoneNumber: string): Promise<UserDocument> {
    const userExists = await this.findByPhoneNumber(phoneNumber);

    if (!userExists) {
      throw new HttpException(
        "your provided credentials aren't correct",
        HttpStatus.BAD_REQUEST
      );
    }

    return userExists;
  }

  async validateByPhoneNumber(
    phoneNumber: string
  ): Promise<UserDocument | undefined> {
    const userExists = await this.findByPhoneNumber(phoneNumber);

    if (userExists) {
      throw new BadRequestException(
        "an account with this credentials already exists"
      );
    }

    return;
  }

  private findByPhoneNumber(
    phoneNumber: string
  ): Promise<UserDocument | undefined> {
    return this.userModel.findOne({ phoneNumber: phoneNumber }).exec();
  }

  async findByIdOrThrow(userId: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user) {
      throw new BadRequestException("there in no user with this id");
    }

    return user;
  }

  async update(
    userId: string,
    updateUserInput: UpdateUserInput
  ): Promise<UserDocument | undefined> {
    const user = await this.findByIdOrThrow(userId);

    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateUserInput },
      { new: true }
    );
  }

  async remove(userId: string) {
    const user = await this.findByIdOrThrow(userId);

    return await this.userModel.findOneAndDelete(
      { _id: userId },
      { new: true }
    );
  }
}
