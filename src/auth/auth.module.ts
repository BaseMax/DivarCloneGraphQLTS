import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Auth } from "./entities/auth.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserSchema } from "./dto/signup.dto";
import { UserService } from "src/user/user.service";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([{ name: "users", schema: UserSchema }]),
  ],
  providers: [AuthResolver, AuthService, UserService, JwtAuthGuard],

  exports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow("SECRET_KEY"),
        signOptions: { expiresIn: "1d" },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
