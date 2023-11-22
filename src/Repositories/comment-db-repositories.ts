import { LikeStatusEnum } from '../enam/like-status-enum';
import { LikesInfoClass } from '../types/commentType';
import { CommentView, Comments } from '../types/commentType';
import { PaginationType } from '../types/types';
import { CommentsModel } from '../db/db';
import { ObjectId } from "mongodb";


export class CommentRepositories {
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
	  async findCommentById(id: string, userId?: string): Promise<CommentView | null> {
		try {
		  const commentById: Comments | null = await CommentsModel.findOne({
			_id: new ObjectId(id),
		  });
		  if (!commentById) {
			return null;
		  }
		  const resultDataLike = await this.resultLikeProcessing(id, userId)
		  return commentDBToView(commentById, resultDataLike);
		} catch (e) {
		  return null;
		}
	  }
	  async findCommentByPostId(
		postId: string,
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string
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
		return {
		  pagesCount: pagesCount,
		  page: +pageNumber,
		  pageSize: +pageSize,
		  totalCount: totalCount,
		  items: commentByPostId.map(function (item) {
			return commentDBToView(item);
		  }),
		};
	  }
	  async createNewCommentPostId(
		newComment: Comments
	  ): Promise<CommentView> {
		await CommentsModel.insertMany([newComment]);
		return commentDBToView(newComment);
	  }
	  async resultLikeProcessing(id: string, userId: string) {
		const like = await LikesModel.countDocuments({})
		const dislike = await LikesModel.countDocuments({})
		if(!userId) {
			return {
				likesCount: like,
				dislikeCount: dislike,
				myStatus: LikeStatusEnum.None
			}
		}
		const likeStatusUser = await LikesModel.findOne({$and: {}})
		return {
			likeCount: like,
			dislikeCount: dislike,
			myStatus: likeStatusUser !== null ? likeStatusUser.myStatus : LikeStatusEnum.None
		}
	  }
}

const commentDBToView = (item: Comments, likesInfo: LikesInfoClass): CommentView => {
	return {
	  _id: new ObjectId(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	  likeInfo: {
		likesCount: likesInfo.likesCount || 0,
    	dislikesCount: likesInfo.dislikeCount || 0,
    	myStatus: likesInfo.myStatus || LikeStatusEnum.None
	  }
	};
  };

