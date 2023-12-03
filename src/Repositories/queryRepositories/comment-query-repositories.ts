import { ObjectId } from "mongodb";
import { CommentsModel, LikesModel } from "../../db/db";
import { PaginationType } from "../../types/types";
import { LikeStatusEnum } from "../../enum/like-status-enum";
import { commentDBToView } from "../../utils/helpers";
import { CommentViewModel, CommentsDB } from "../../types/commentType";

export class QueryCommentRepositories {
  async findLikesCommentByUser(commentId: string, userId: ObjectId) {
    return LikesModel.findOne({
      $and: [{ userId: userId }, { commentId: commentId }],
    });
  }
  async findCommentByCommentId(commentId: string, userId?: ObjectId | null) {
    const commentById: CommentsDB | null = await CommentsModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!commentById) {
      return null;
    }
	return commentById
	
  }
  async findLikeCommentByUser(commentId: string, userId: ObjectId) {
	const likeModel = LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	return likeModel
}
  async findCommentById(commentId: string, userId: string): Promise<CommentViewModel | null> {
    try {
      const commentById: CommentsDB | null = await CommentsModel.findOne({
        _id: new ObjectId(commentId),
      });
      if (!commentById) {
        return null;
      }
	  const findLike = await this.findLikeCommentByUser(commentId, new ObjectId(userId))
      return commentDBToView(commentById, findLike?.myStatus ?? null);
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
  ): Promise<PaginationType<CommentViewModel> | null> {
    const filter = { postId: postId };
    const commentByPostId: CommentsDB[] = await CommentsModel.find(filter)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await CommentsModel.countDocuments(filter);
    const pagesCount: number = await Math.ceil(totalCount / +pageSize);

    const items: CommentViewModel[] = [];
    await Promise.race(commentByPostId.map(async (item) => {
		const findLike = await LikesModel.findOne({$and: [{userId: new ObjectId(userId)}, {commentId: item._id.toString()}]})
      const commnent = commentDBToView(item, findLike?.myStatus ?? null);
	  console.log("comment: ", commnent)
      items.push(commnent);
    }))
console.log("items: ", items)
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items,
    };
  }
}
