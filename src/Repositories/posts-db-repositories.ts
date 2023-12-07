import { Posts, PostsDB } from "../types/postsTypes";
import { PostsModel } from "../db/db";
import { ObjectId } from "mongodb";

export class PostsRepositories {
  async createNewPosts(newPost: PostsDB): Promise<PostsDB> {
    const result = await PostsModel.create(newPost);
    return newPost;
  }
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string, 
    blogId: string
  ): Promise<boolean> {
    const result = await PostsModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );
    return result.matchedCount === 1;
  }
  async deletedPostById(id: string): Promise<boolean> {
    const result = await PostsModel.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
  async deleteRepoPosts(): Promise<boolean> {
    const deletedAll = await PostsModel.deleteMany({});
    return deletedAll.acknowledged;
  }
}
