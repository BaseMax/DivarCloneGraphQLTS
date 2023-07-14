import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostResolver } from "./post.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./dto/create-post.input";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "posts", schema: PostSchema }]),
    AuthModule,
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
