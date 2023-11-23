import { CommentView } from '../types/commentType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { Comments } from '../types/commentType'
import { LikesInfoSchema } from './likesInfo-schema';

export const CommentViewSchema = new mongoose.Schema<WithId<CommentView>>({
	content: {type: String, required: true},
	commentatorInfo: {
		userId: {type: String, required: true},
		userLogin: {type: String, required: true}
	},
	createdAt: {type: String, required: true},
	likesInfo: LikesInfoSchema
})

export const CommentSchema = new mongoose.Schema<WithId<Comments>>({
	content: {type: String, required: true},
	commentatorInfo: {
		userId: {type: String, required: true},
		userLogin: {type: String, required: true},
	},
	postId: {type: String, required: true},
	createdAt: {type: String, required: true},
	likesInfo: LikesInfoSchema
})