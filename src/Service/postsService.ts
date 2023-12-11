import { PostsDB, PostsViewModel } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';
import { ObjectId } from 'mongodb';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';
import { CommentService } from './commentService';
import { LikesRepositories } from '../Repositories/limit-db-repositories';

export class PostsService {
	constructor(
		protected postsRepositories: PostsRepositories,
		protected queryUsersRepositories: QueryUsersRepositories,
		protected queryPostsRepositories: QueryPostsRepositories,
		protected queryCommentRepositories: QueryCommentRepositories,
		protected commentService: CommentService,
		protected likesRepositories: LikesRepositories
		) {
	}
	async createPost(
		blogId: string,
		title: string,
		shortDescription: string,
		content: string,
		blogName: string,
	  ): Promise<PostsViewModel | null> {
		const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName, extendedLikesInfo)
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
	  async updateLikeStatus(likeStatus: string, postId: string, userId: ObjectId) {
		// const userName = await this.queryUsersRepositories.findUserById(userId)
		// const post = await this.queryPostsRepositories.findPostById(postId)
		
		// const updateLikeStatus = await this.commentService.updateLikeStatus(likeStatus, postId, userId)
		// if(!updateLikeStatus) {
		// 	return false
		// }
		// await this.commentService.updateLikeStatus(findLike!.myStatus ?? null, postId, _id);

		
			const findLike = await this.likesRepositories.findLikePostByUser(postId, new ObjectId(userId))
			if(!findLike) {
				await this.likesRepositories.saveLikeForPost(postId, new ObjectId(userId), likeStatus)
				const resultCheckListOrDislike = await this.postsRepositories.increase(postId, likeStatus)
				return true
			} 
			
			if((findLike.myStatus === 'Dislike' || findLike.myStatus === 'Like') && likeStatus === 'None'){
				await this.likesRepositories.updateLikeStatusForPost(postId, new ObjectId(userId), likeStatus)
				const resultCheckListOrDislike = await this.postsRepositories.decrease(postId, findLike.myStatus)
				return true
			}
	
			if(findLike.myStatus === 'None' && (likeStatus === 'Dislike' || likeStatus === 'Like')) {
				await this.likesRepositories.updateLikeStatusForPost(postId, new ObjectId(userId), likeStatus)
				const resultCheckListOrDislike = await this.postsRepositories.increase(postId, likeStatus)
				return true
			}
	
			if(findLike.myStatus === 'Dislike' && likeStatus === 'Like') {
				await this.likesRepositories.updateLikeStatusForPost(postId, new ObjectId(userId), likeStatus)
				const changeDislikeOnLike = await this.postsRepositories.increase(postId, likeStatus)
				const changeLikeOnDislike = await this.postsRepositories.decrease(postId, findLike.myStatus)
				return true
			}
			if(findLike.myStatus === 'Like' && likeStatus === 'Dislike') {
				await this.likesRepositories.updateLikeStatusForPost(postId, new ObjectId(userId), likeStatus)
				const changeLikeOnDislike = await this.postsRepositories.decrease(postId, findLike.myStatus)
				const changeDislikeOnLike = await this.postsRepositories.increase(postId, likeStatus)
				return true
			}
			return 
		}
	  
}