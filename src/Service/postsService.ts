import { PostsDB, PostsViewModel } from '../types/postsTypes';
import { PostsRepositories } from '../Repositories/posts-db-repositories';
import { ObjectId } from 'mongodb';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';
import { CommentService } from './commentService';
import { LikesRepositories } from '../Repositories/limit-db-repositories';
import { LikesModel, PostsModel } from '../db/db';
import { LikeStatusEnum } from '../enum/like-status-enum';

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
		const newPost: PostsDB = new PostsDB(title, shortDescription, content, blogId, blogName)
		// console.log(newPost)
		const createPost: PostsDB = await this.postsRepositories.createNewPosts(newPost);
		const post = await PostsModel.findOne({ blogId: blogId }, {__v: 0 }).lean();
		const newestLikes = await LikesModel.find({postId: newPost._id}).sort({addedAt: -1}).limit(3).skip(0).lean()
		let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		if(blogId){
			const reaction = await LikesModel.findOne({blogId: blogId})
			myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		}
		return createPost.getPostViewModel(myStatus, newestLikes);
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
	  async updateLikeStatus(likeStatus: string, postId: string, userId: ObjectId, userLogin: string): Promise<boolean | void> {
			const findLike = await this.likesRepositories.findLikePostByUser(postId, new ObjectId(userId))
			if(!findLike) {
				await this.likesRepositories.saveLikeForPost(postId, new ObjectId(userId), likeStatus, userLogin)
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