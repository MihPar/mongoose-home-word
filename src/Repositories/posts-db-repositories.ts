import { Posts } from "../types/postsTypes";
import { PostsModel } from "../db/db";

export class PostsRepositories {
  async createNewBlogs(newPost: Posts): Promise<Posts> {
    const result = await PostsModel.insertMany({ ...newPost });
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
      { id: id },
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
    const result = await PostsModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }
  async deleteRepoPosts(): Promise<boolean> {
    const deletedAll = await PostsModel.deleteMany({});
    return deletedAll.acknowledged;
  }
}
