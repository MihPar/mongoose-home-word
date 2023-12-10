import { queryCommentRepositories } from './../Compositions-root/posts-composition-root';
import { Like } from './../types/likesInfoType';
import { queryUsersRepositories } from './../Compositions-root/user-composition-root';
import { PostsDB, PostsViewModel } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';
import { LikeInputModel } from '../types/likesInfoType';
import { ObjectId } from 'mongodb';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';
import { CommentService } from './commentService';

export class PostsService {
	constructor(
		protected postsRepositories: PostsRepositories,
		protected queryUsersRepositories: QueryUsersRepositories,
		protected queryPostsRepositories: QueryPostsRepositories,
		protected queryCommentRepositories: QueryCommentRepositories,
		protected commentService: CommentService
		) {
	}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string,
		blogName: string
	  ): Promise<PostsViewModel | null> {
		const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName)
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
	  async updateLikeDislike(likeStatus: string, postId: string, _id: ObjectId) {
		const userName = await this.queryUsersRepositories.findUserById(_id)
		const post = await this.queryPostsRepositories.findPostById(postId)
		const findLike = await this.queryCommentRepositories.findLikeCommentByUser(postId, new ObjectId(_id))
		if(!findLike) {
			return false
		}
		await this.commentService.updateltLikeStatus(findLike!.myStatus ?? null, postId, _id);
		return true
	  }
}