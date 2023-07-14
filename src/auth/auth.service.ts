import { BadRequestException, Injectable } from "@nestjs/common";
import { SignupInput } from "./dto/signup.dto";
import { LoginInput } from "./dto/login.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "../user/interface/user.document";
import * as argon2 from "argon2";
import { AuthPayload } from "./interface/auth.payload";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "jsonwebtoken";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("users") private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async signup(signupDto: SignupInput): Promise<AuthPayload> {
    await this.userService.validateByPhoneNumber(signupDto.phoneNumber);
    const newUser = await this.userModel.create({
      name: signupDto.name,
      password: await argon2.hash(signupDto.password),
      phoneNumber: signupDto.phoneNumber,
    });


    const token = this.getToken({ sub: newUser._id, name: newUser.name });

    return { token, name: newUser.name };
  }

  async login(loginDto: LoginInput): Promise<AuthPayload> {
    const user = await this.userService.findByPhoneNumberOrThrow(
      loginDto.phoneNumber
    );

    const isValidPassword = await argon2.verify(
      user.password,
      loginDto.password
    );

    if (!isValidPassword) {
      throw new BadRequestException("the provided credentials aren't correct.");
    }

    const token = this.getToken({ sub: user._id, name: user.name });

    return { token, name: user.name };
  }

  getToken(jwtPayload: JwtPayload): string {
    return this.jwtService.sign(jwtPayload);
  }
}
