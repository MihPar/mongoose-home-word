import { PostsDB } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';

export class PostsService {
	constructor(protected postsRepositories: PostsRepositories) {
	}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string,
		blogName: string
	  ): Promise<PostsDB | null> {
		// const blog: BlogsDB | null = await BlogsModel.findOne({
		//   id: blogId,
		// });
		// if (!blog) return null;
		const newPost: PostsDB = new PostsDB(blogId, title, shortDescription, content, blogName,)

		// const newPost: Posts = {
		//   _id: new ObjectId(),
		//   title,
		//   shortDescription,
		//   content,
		//   blogId,
		//   blogName: blog.name,
		//   createdAt: new Date().toISOString(),
		// };
		const createPost: PostsDB = await this.postsRepositories.createNewBlogs(newPost);
		return createPost.getPostsViewModel();
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