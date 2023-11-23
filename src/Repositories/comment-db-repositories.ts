import { LikeStatusEnum } from '../enum/like-status-enum';
import { CommentView, Comments } from '../types/commentType';
import { PaginationType } from '../types/types';
import { CommentsModel, LikesModel } from '../db/db';
import { ObjectId } from "mongodb";
import { LikesInfoClass } from '../types/likesInfoType';
import { commentDBToView } from '../Service/commentService';



export class CommentRepositories {
	async createLike(commentId: string, userId: ObjectId, likeStatus: string) {
		const saveResult = await LikesModel.create({commentId: commentId, userId: userId, likeStatus: likeStatus})
        return saveResult.id
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
		newComment: Comments
	  ): Promise<CommentView> {
		await CommentsModel.insertMany([newComment]);
		return commentDBToView(newComment);
	  }
}



