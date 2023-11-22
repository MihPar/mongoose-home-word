import { ObjectId } from 'mongodb';
import { BlogsModel } from '../db/db';
import { Blogs } from '../types/blogsType';
import { Posts } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';

export class PostsService {
	postsRepositories: PostsRepositories
	constructor() {
		this.postsRepositories = new PostsRepositories()
	}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string
	  ): Promise<Posts | null> {
		const blog: Blogs | null = await BlogsModel.findOne({
		  id: blogId,
		});
		if (!blog) return null;
		const newPost: Posts = {
		  _id: new ObjectId(),
		  title,
		  shortDescription,
		  content,
		  blogId,
		  blogName: blog.name,
		  createdAt: new Date().toISOString(),
		};
		const post = await this.postsRepositories.createNewBlogs(newPost);
		return post;
	  }
	  async updateOldPost(
		id: string,
		title: string,
		shortDescription: string,
		content: string,
		blogId: string
	  ): Promise<boolean> {
		const updatPostById: boolean = await this.postsRepositories.updatePost(
		  id,
		  title,
		  shortDescription,
		  content,
		  blogId
		);
		return updatPostById;
	  }
	  async deletePostId(id: string): Promise<boolean> {
		return await this.postsRepositories.deletedPostById(id);
	  }
	  async deleteAllPosts(): Promise<boolean> {
		return await this.postsRepositories.deleteRepoPosts();
	  }
}

// export const postsService = new PostsService()
