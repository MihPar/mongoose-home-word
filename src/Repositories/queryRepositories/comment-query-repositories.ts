import { ObjectId } from "mongodb";
import { CommentsModel, LikesModel } from "../../db/db";
import { PaginationType } from "../../types/types";
import { LikeStatusEnum } from "../../enum/like-status-enum";
import { commentDBToView } from "../../utils/helpers";
import { CommentViewModel, CommentsDB } from "../../types/commentType";
import { Like } from "../../types/likesInfoType";

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
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    //const items: CommentViewModel[] = [];
	let findLike
	let status: Like | null
    const items: CommentViewModel[] = await Promise.all(commentByPostId.map(async (item) => {
		findLike = null;
		if(userId){
		status = await LikesModel.findOne({
			userId,
			commentId: item._id.toString()
		});
		findLike = status ? status.myStatus : null
		}
		
      const commnent = commentDBToView(item, findLike);
	  console.log("comment: ", commnent)
      return commnent;
    }))
	// const result: PaginationType<CommentViewModel> | null = {
	// 	pagesCount: pagesCount,
	// 	page: +pageNumber,
	// 	pageSize: +pageSize,
	// 	totalCount: totalCount,
	// 	items: commentByPostId.map((item) => CommentsDB.getNewComments(item, status!.myStatus))
	// }
	// return result
	console.log("85 items: ", items)
    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items,
    };
  }
}
