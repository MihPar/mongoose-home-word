import { ObjectId } from "mongodb"
import { Blogs } from '../types/blogsType';
import { BlogsRepositories } from "../Repositories/blogs-db-repositories";

export class BlogsService {
	blogsRepositories: BlogsRepositories
	constructor() {
		this.blogsRepositories = new BlogsRepositories()
	}
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
		const createBlog = await this.blogsRepositories.createNewBlogs(newBlog);
		return createBlog;
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
