import { CommentView } from '../types/commentType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { Comments } from '../types/commentType'
import { LikeStatusEnum } from '../enum/like-status-enum';

export const CommentViewSchema = new mongoose.Schema<WithId<CommentView>>({
	content: {type: String, required: true},
	commentatorInfo: {
		userId: {type: String, required: true},
		userLogin: {type: String, required: true}
	},
	createdAt: {type: String, required: true},
	likesInfo: {
		likesCount: {type: Number, required: true},
		dislikesCount: {type: Number, required: true},
		myStatus:{
			type: String,
			default: LikeStatusEnum.None,
			enum: Object.values(LikeStatusEnum)
		  },
	  }
})

export const CommentSchema = new mongoose.Schema<WithId<Comments>>({
	content: {type: String, required: true},
	commentatorInfo: {
		userId: {type: String, required: true},
		userLogin: {type: String, required: true},
	},
	postId: {type: String, required: true},
	createdAt: {type: String, required: true},
	likesCount: {type: Number, required: true},
	dislikesCount: {type: Number, required: true}
})