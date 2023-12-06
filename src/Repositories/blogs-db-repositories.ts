import { ObjectId } from "mongodb";
import { BlogsModel } from "../db/db";
import { Blogs, BlogsDB } from "../types/blogsType";

export class BlogsRepositories {
  async createNewBlogs(newBlog: BlogsDB): Promise<BlogsDB> {
    const result = await BlogsModel.create(newBlog);
    return newBlog;
  }
  async updateBlogById(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await BlogsModel.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: name, description: description, websiteUrl: websiteUrl } }
    );
    return result.modifiedCount === 1;
  }
  async deletedBlog(id: string): Promise<boolean> {
	// console.log('ID', id)
    const result = await BlogsModel.deleteOne({ _id: new ObjectId(id) });
	// console.log('result', result)
    return result.deletedCount === 1;
  }
  async deleteRepoBlogs(): Promise<boolean> {
    const deletedAll = await BlogsModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  }
}