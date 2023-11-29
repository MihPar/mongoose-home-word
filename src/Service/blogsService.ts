import { ObjectId } from "mongodb"
import { Blogs, BlogsDB } from '../types/blogsType';
import { BlogsRepositories } from "../Repositories/blogs-db-repositories";

export class BlogsService {
  constructor(protected blogsRepositories: BlogsRepositories) {}
  async createNewBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<Blogs> {
    const newBlog: BlogsDB = new BlogsDB(name, description, websiteUrl, true)
    const createBlog: BlogsDB = await this.blogsRepositories.createNewBlogs(newBlog);
    return createBlog.getBlogsViewModel();
  }
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    return await this.blogsRepositories.updateBlogById(
      id,
      name,
      description,
      websiteUrl
    );
  }
  async deleteAllBlogs(): Promise<boolean> {
    return await this.blogsRepositories.deleteRepoBlogs();
  }
}

// export const blogsService = new BlogsService()
