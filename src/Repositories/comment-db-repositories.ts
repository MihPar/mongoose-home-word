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
	async findLikesCommentByUser(commentId: string, userId: ObjectId) {
		return LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
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
	  async findCommentById(commentId: string): Promise<CommentView | null> {
		try {
		  const commentById: Comments | null = await CommentsModel.findOne({
			_id: new ObjectId(commentId),
		  });
		  if (!commentById) {
			return null;
		  }
		  return commentDBToView(commentById);
		} catch (e) {
		  return null;
		}
	  }
	  async findCommentByPostId(
		postId: string,
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string,
		userId: ObjectId
	  ): Promise<PaginationType<CommentView> | null> {
		const filter = { postId: postId };
		const commentByPostId: Comments[] = await CommentsModel
		  .find(filter)
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .lean();
		const totalCount: number = await CommentsModel.countDocuments(filter);
		const pagesCount: number = await Math.ceil(totalCount / +pageSize);

		const items: CommentView[] = []

		commentByPostId.forEach( async (item) => {
			const likesInfo = await this.resultLikeProcessing(item._id.toString(), userId)
			const commnent = commentDBToView(item, likesInfo)

			items.push(commnent)
		})

		return {
		  pagesCount: pagesCount,
		  page: +pageNumber,
		  pageSize: +pageSize,
		  totalCount: totalCount,
		  items,
		};
	  }
	  async createNewCommentPostId(
		newComment: Comments
	  ): Promise<CommentView> {
		await CommentsModel.insertMany([newComment]);
		return commentDBToView(newComment);
	  }
	  async resultLikeProcessing(commentId: string, userId: ObjectId) {
		const like = await LikesModel.countDocuments({commentId: commentId, myStatus: 'Like'})
		const dislike = await LikesModel.countDocuments({commentId: commentId, myStatus: 'Dislike'})
		
		const likeStatusUser = await LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
		return {
			likesCount: like,
			dislikesCount: dislike,
			myStatus: likeStatusUser !== null ? likeStatusUser.myStatus : LikeStatusEnum.None
		}
	  }
}



