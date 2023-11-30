import { ObjectId } from "mongodb"
import { LikesModel } from "../db/db"

export class LikesRepositories  {
	async saveLike(commentId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, likeStatus: likeStatus})
		return saveResult.id
	}
	async updateLikeStatus(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {likeStatus: likeStatus})
		return saveResult
	}
	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
		return LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	}
}
