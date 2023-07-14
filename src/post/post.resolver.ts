import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post } from "./entities/post.entity";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { GetCurrentUserId } from "src/decorators/get.current.userId";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt.auth.guard";
import { Sort } from "./dto/sort.post";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post, { name: "createPost" })
  createPost(
    @Args("createPostInput") postDto: CreatePostInput,
    @GetCurrentUserId() userId: string
  ) {
    return this.postService.create(postDto, userId);
  }

  @Query(() => [Post], { name: "allPosts" })
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post, { name: "updateUserPost" })
  updatePost(
    @Args("updatePostInput") updatePostDto: UpdatePostInput,
    @GetCurrentUserId() userId: string
  ) {
    return this.postService.update(updatePostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post, { name: "removePost" })
  removePost(
    @Args("postId", { type: () => String }) postId: string,
    @GetCurrentUserId() userId: string
  ) {
    return this.postService.remove(postId, userId);
  }

  @Query(() => [Post], { name: "sortBy" })
  sortBy(@Args("sortBy") sortBy: Sort) {
    return this.postService.sortBy(sortBy.filed);
  }

    @Query(() => [Post], { name: "searchByKeyword" })
    search(@Args("keyword") keyword: string) {
      return this.postService.searchByKeyword(keyword);
    }
}
