import { ObjectId } from "mongodb"
import { Blogs } from './../UI/types/blogsType';
import { blogsRepositories } from "../DataAccessLayer/blogs-db-repositories";

class BlogsService {
	async createNewBlog(
		name: string,
		description: string,
		websiteUrl: string
	  ): Promise<Blogs> {
		const newBlog: Blogs = {
		  _id: new ObjectId(),
		  name,
		  description,
		  websiteUrl,
		  createdAt: new Date().toISOString(),
		  isMembership: false,
		};
		const createBlog = await blogsRepositories.createNewBlogs(newBlog);
		return createBlog;
	  }
	  async updateBlog(
		id: string,
		name: string,
		description: string,
		websiteUrl: string
	  ): Promise<boolean> {
		return await blogsRepositories.updateBlogById(
		  id,
		  name,
		  description,
		  websiteUrl
		);
	  }
	  async deleteAllBlogs(): Promise<boolean> {
		return await blogsRepositories.deleteRepoBlogs();
	  }
}

export const blogsService = new BlogsService()
