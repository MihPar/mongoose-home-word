import { ObjectId } from "mongodb"
import { LikesModel } from "../db/db"
import { Like } from "../types/likesInfoType"

export class LikesRepositories  {
	async saveLikeForComment(commentId: string, userId: ObjectId, likeStatus: string) {
		// console.log("typeof userId: ", typeof userId)
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, myStatus: likeStatus, postId: null})
		// console.log(saveResult, "we are in saveResult")
		const usesrComment = await LikesModel.findOne({userId: userId, commentId: commentId}, {__v: 0}).lean() //
		// console.log("userComment: ", usesrComment)
		// return saveResult.id
	}
	async updateLikeStatusForComment(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {myStatus: likeStatus})
		return saveResult
	}
	async saveLikeForPost(postId: string, userId: ObjectId, likeStatus: string): Promise<string> {
		// console.log("typeof userId: ", typeof userId)
		const saveResult = await LikesModel.create({postId: postId, userId: userId, myStatus: likeStatus})
		// console.log(saveResult, "we are in saveResult")
		const usesrComment = await LikesModel.findOne({userId: userId, postId: postId}, {__v: 0}).lean() //
		// console.log("userComment: ", usesrComment)
		return saveResult.id
	}
	async updateLikeStatusForPost(postId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.updateOne({postId: postId, userId: userId}, {myStatus: likeStatus})
		return saveResult
	}
	async findLikeCommentByUser(postId: string, userId: ObjectId) {
		return LikesModel.findOne({$and: [{userId: userId}, {postId: postId}]}, {__v: 0}).lean() //
	}
	async findLikePostByUser(postId: string, userId: ObjectId): Promise<Like | null> {
		return LikesModel.findOne({$and: [{userId: userId}, {postId: postId}]}, {__v: 0}).lean() //
	}
}
