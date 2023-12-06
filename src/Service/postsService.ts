import { PostsDB, PostsViewModel } from '../types/postsTypes';
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
	  ): Promise<PostsViewModel | null> {
		const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName,)
		const createPost: PostsDB = await this.postsRepositories.createNewPosts(newPost);
		return createPost.getPostViewModel();
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