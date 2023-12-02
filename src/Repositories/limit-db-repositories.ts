import { ObjectId } from "mongodb"
import { LikesModel } from "../db/db"

export class LikesRepositories  {
	async saveLikeForComment(commentId: string, userId: ObjectId, likeStatus: string) {
		// console.log("we are in saveLike")
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, likeStatus: likeStatus, postId: null})
		// console.log(saveResult, "we are in saveResult")
		return saveResult.id
	}
	async updateLikeStatusForComment(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {likeStatus: likeStatus})
		return saveResult
	}
	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
		return LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	}
}
