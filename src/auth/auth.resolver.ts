import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";
import { SignupInput } from "./dto/signup.dto";
import { LoginInput } from "./dto/login.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt.auth.guard";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Auth, { name: "signup" })
  signup(@Args("signupInput") signupDto: SignupInput) {
    return this.authService.signup(signupDto);
  }

  @Mutation(() => Auth, { name: "login" })
  login(@Args("loginInput") loginDto: LoginInput) {
    return this.authService.login(loginDto);
  }
}
