import { Like } from './../types/likesInfoType';
import { queryUsersRepositories } from './../Compositions-root/user-composition-root';
import { PostsDB, PostsViewModel } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';
import { LikeInputModel } from '../types/likesInfoType';
import { ObjectId } from 'mongodb';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';

export class PostsService {
	constructor(
		protected postsRepositories: PostsRepositories,
		protected queryUsersRepositories: QueryUsersRepositories,
		protected queryPostsRepositories: QueryPostsRepositories
		) {
	}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string,
		blogName: string
	  ): Promise<PostsViewModel | null> {
		const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName, )
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
	  async updateLikeDislike(body: LikeInputModel, postId: string, _id: ObjectId) {
		const userName = await this.queryUsersRepositories.findUserById(_id)
		const post = await this.queryPostsRepositories.findPostById(postId)
		const findLike = await Like.checkUserLike(post!.likes, _id)
		if(!findLike) {
			const newLike = new Like
		}
	  }
}