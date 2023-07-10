import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/auth/dto/signup.dto";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),AuthModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
