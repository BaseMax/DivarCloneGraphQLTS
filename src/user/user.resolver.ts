import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput } from "./dto/update-user.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { GetCurrentUserId } from "src/decorators/get.current.userId";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: "findAllUsers" })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: "findOnUser" })
  findOne(@GetCurrentUserId() userId: string) {
    return this.userService.findByIdOrThrow(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args("updateUserInput") updateUserDto: UpdateUserInput,
    @GetCurrentUserId() userId: string
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { name: "removeUser" })
  removeUser(@GetCurrentUserId() userId: string) {
    return this.userService.remove(userId);
  }
}
