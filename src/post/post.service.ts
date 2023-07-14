import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { CreatePostInput } from "./dto/create-post.input";
import { UpdatePostInput } from "./dto/update-post.input";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostDocument } from "./interfaces/post.document";

@Injectable()
export class PostService {
  constructor(@InjectModel("posts") private postModel: Model<PostDocument>) {}

  async create(
    postDto: CreatePostInput,
    authorId: string
  ): Promise<PostDocument> {
    return await this.postModel.create({
      authorId: authorId,
      ...postDto,
    });
  }

  async findAll(): Promise<PostDocument[]> {
    return await this.postModel.find();
  }

 

  async sortBy(field: string): Promise<PostDocument[]> {
    return await this.postModel.find().sort({ [field]: 1 });
  }

  async findByIdOrThrow(postId: string): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);

    if (!post)
      throw new BadRequestException("there is no post with this credentials");

    return post;
  }

  async searchByKeyword(keyword: string): Promise<PostDocument[]> {
    return await this.postModel.find(
      {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          {
            description: { $regex: keyword, $options: "i" },
          },
          { location: { $regex: keyword, $options: "i" } },
        ],
      },
      {}
    );
  }

  async update(
    updatePostDto: UpdatePostInput,
    userId: string
  ): Promise<PostDocument> {
    const post = await this.findByIdOrThrow(updatePostDto.id);

    const isAllowed = this.hasPermissionToChange(post, userId);
    if (!isAllowed) {
      throw new ForbiddenException(
        "you aren't allowed to make change to this post"
      );
    }
    await post.updateOne(updatePostDto, { new: true });
    return await post.save();
  }

  hasPermissionToChange(post: PostDocument, userId: string): boolean {
    return post.authorId === userId ? true : false;
  }

  async remove(postId: string, userId: string): Promise<PostDocument> {
    const post = await this.findByIdOrThrow(postId);

    const isAllowed = this.hasPermissionToChange(post, userId);
    if (!isAllowed) {
      throw new ForbiddenException(
        "you aren't allowed to make change to this post"
      );
    }

    return await post.deleteOne();
  }
}
