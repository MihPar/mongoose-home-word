import { CommentView, Comments } from '../types/commentType';
import { CommentsModel, LikesModel } from '../db/db';
import { ObjectId } from "mongodb";
import { commentDBToView } from '../utils/helpers';



export class CommentRepositories {
	async increase(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: 1} : {likesCont: 1}})
	}
	async decrease(commentId: string, likeStatus: string){
		if(likeStatus !== 'Dislike' && likeStatus !== 'Like') {
			return
		} 
		return await CommentsModel.updateOne({_id: new ObjectId(commentId)}, {$inc: likeStatus === 'Dislike' ? {dislikesCount: -1} : {likesCont: -1}})
	}
	async saveLike(commentId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, likeStatus: likeStatus})
        return saveResult.id
	}
	async updateLikeStatus(commentId: string, userId: ObjectId, likeStatus: string){
		const saveResult = await LikesModel.updateOne({commentId: commentId, userId: userId}, {likeStatus: likeStatus})
        return saveResult
	}
	async findLikeCommentByUser(commentId: string, userId: ObjectId) {
        return LikesModel.findOne({$and: [{userId: userId}, {parentId: commentId}]})
    }
	async updateComment(commentId: string, content: string) {
		const updateOne = await CommentsModel.updateOne(
		  { _id: new ObjectId(commentId) },
		  { $set: { content: content } }
		);
		return updateOne.matchedCount === 1;
	  }
	  async deleteComment(commentId: string): Promise<boolean> {
		try {
		  const deleteComment = await CommentsModel.deleteOne({
			_id: new ObjectId(commentId),
		  });
		  return deleteComment.deletedCount === 1;
		} catch (err) {
		  return false;
		}
	  }
	  async createNewCommentPostId(
		newComment: Comments, userId: string, postId: string
	  ): Promise<CommentView> {
		const findLike = LikesModel.findOne({$and: [{userId: userId}, {postId: postId}]})
		await CommentsModel.insertMany([newComment]);
		return commentDBToView(newComment, findLike?.myStatus ?? null);
	  }
	  async deleteAllComments(): Promise<boolean> {
		const deletedAll = await CommentsModel.deleteMany({});
		return deletedAll.acknowledged;
	  }
}



