import { ObjectId } from "mongodb"
import { LikesModel } from "../db/db"

export class LikesRepositories  {
	async saveLikeForComment(commentId: string, userId: ObjectId, likeStatus: string) {
		// console.log("typeof userId: ", typeof userId)
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, myStatus: likeStatus, postId: null})
		// console.log(saveResult, "we are in saveResult")
		const usesrComment = await LikesModel.findOne({userId: userId, commentId: commentId})
		// console.log("userComment: ", usesrComment)
		return saveResult.id
	}
	async updateLikeStatusForComment(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {myStatus: likeStatus})
		return saveResult
	}
	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
		return LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	}
}
