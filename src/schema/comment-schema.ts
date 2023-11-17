import { CommentType, CommentTypeView } from './../UI/types/commentType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

// export const CommentViewSchema = new mongoose.Schema<WithId<CommentTypeView>>({
// 	content: {type: String, require: true},
// 	commentatorInfo: {
// 		userId: {type: String, require: true},
// 		userLogin: {type: String, require: true}
// 	},
// 	createdAt: {type: String, require: true}
// })

export const CommentSchema = new mongoose.Schema<WithId<CommentType>>({
	content: {type: String, require: true},
	commentatorInfo: {
		userId: {type: String, require: true},
		userLogin: {type: String, require: true},
	},
	postId: {type: String, require: true},
	createdAt: {type: String, require: true},
})