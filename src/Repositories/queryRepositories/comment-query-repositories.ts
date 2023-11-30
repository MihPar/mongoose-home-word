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
  async findCommentByCommentId(commentId: string, userId: ObjectId) {
    const commentById: CommentsDB | null = await CommentsModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!commentById) {
      return null;
    }
	const findLike = await this.findLikeCommentByUser(commentId, userId)
	return commentDBToView(commentById, findLike?.myStatus ?? null)
  }
  async findLikeCommentByUser(commentId: string, userId: ObjectId) {
	return LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
}
  async findCommentById(commentId: string, userId: ObjectId): Promise<CommentViewModel | null> {
	console.log("28: ", commentId)
    try {
      const commentById: CommentsDB | null = await CommentsModel.findOne({
        _id: new ObjectId(commentId),
      });
	  
	  console.log("findCommentById: ", commentById)

      if (!commentById) {
        return null;
      }
	  const findLike = await this.findLikeCommentByUser(commentId, userId)
	  console.log("findLike: ", findLike)
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
	const findLike = await LikesModel.findOne({$and: [{userId: userId}, {postId: postId}]})
    commentByPostId.forEach(async (item) => {
      const commnent = commentDBToView(item, findLike?.myStatus ?? null);
      items.push(commnent);
    });

    return {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items,
    };
  }
  async resultLikeProcessing(likeStatus: string, commentId: string, userId: ObjectId) {
    const like = await LikesModel.countDocuments({
      commentId: commentId,
      myStatus: "Like",
    });
    const dislike = await LikesModel.countDocuments({
      commentId: commentId,
      myStatus: "Dislike",
    });

    const likeStatusUser = await LikesModel.findOne({
      $and: [{ userId: userId }, { commentId: commentId }],
    });
    return {
      likesCount: like,
      dislikesCount: dislike,
      myStatus:
        likeStatusUser !== null ? likeStatusUser.myStatus : LikeStatusEnum.None,
    };
  }
//   findLikeCommentByUser(commentById: Comments, userId: ObjectId): likeInfoType {
// 	// const like = await LikesModel.countDocuments({commentId: commentId, myStatus: 'Like'})
// 	// const dislike = await LikesModel.countDocuments({commentId: commentId, myStatus: 'Dislike'})

// 	// const likeStatusUser = await LikesModel.findOne({$and: [{userId: userId}, {commentId: commentId}]})
	
// 	const likes = commentById.likes

// 	let dislikesCount = 0
// 	let likesCount = 0
// 	let myStatus = likes.find((elem: Like) => {
// 		return elem.userId.toString() === userId.toString()
// 	})?.myStatus || LikeStatusEnum.None

// 	likes.forEach(function(item: Like) {
// 		if(item.myStatus === LikeStatusEnum.Like) {
// 			likesCount++
// 		} else if(item.myStatus === LikeStatusEnum.Dislike) {
// 			dislikesCount++
// 		} 
// 	})

// 	return {
// 		likesCount,
// 		dislikesCount,
// 		myStatus,
// 	}
//   }
}
