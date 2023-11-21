import { CommentView } from './../UI/types/commentType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { Comments } from '../UI/types/commentType'

export const CommentViewSchema = new mongoose.Schema<WithId<CommentView>>({
	content: {type: String, require: true},
	commentatorInfo: {
		userId: {type: String, require: true},
		userLogin: {type: String, require: true}
	},
	createdAt: {type: String, require: true}
})

export const CommentSchema = new mongoose.Schema<WithId<Comments>>({
	content: {type: String, require: true},
	commentatorInfo: {
		userId: {type: String, require: true},
		userLogin: {type: String, require: true},
	},
	postId: {type: String, require: true},
	createdAt: {type: String, require: true},
})