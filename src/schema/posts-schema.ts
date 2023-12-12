import { PostsDB } from '../types/postsTypes';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { LikeStatusEnum } from '../enum/like-status-enum';

export const PostSchema = new mongoose.Schema<WithId<PostsDB>>({
	title: {type: String, require: true},
	shortDescription: {type: String, require: true},
	content: {type: String, require: true},
	blogId: {type: String, require: true},
	blogName: {type: String, require: true},
	createdAt: {type: String, require: true},
	extendedLikesInfo: {
		likesCount: {type: Number, require: true},
		dislikesCount: {type: Number, require: true},
		myStatus: { //
			type: String,
			default: LikeStatusEnum.None,
			enum: ["None", "Like", "Dislike"]
		  },
		  newestLikes: { //
			addedAt: {type: String, require: true},
        	userId: {type: String, require: true},
        	login: {type: String, require: true}
		  } 
	  }
})