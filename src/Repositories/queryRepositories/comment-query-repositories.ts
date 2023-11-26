import { ObjectId } from "mongodb";
import { CommentsModel, LikesModel } from "../../db/db";
import { CommentView, Comments } from "../../types/commentType";
import { PaginationType } from "../../types/types";
import { LikeStatusEnum } from "../../enum/like-status-enum";
import { LikesInfoClass } from "../../types/likesInfoType";
import { commentDBToView } from "../../utils/helpers";

export class QueryCommentRepositories {
  async findLikesCommentByUser(commentId: string, userId: ObjectId) {
    return LikesModel.findOne({
      $and: [{ userId: userId }, { commentId: commentId }],
    });
  }
  async findCommentByCommentId(commentId: string, userId: ObjectId) {
    const commentById: Comments | null = await CommentsModel.findOne({
      _id: new ObjectId(commentId),
    });
    if (!commentById) {
      return null;
    }
    return commentById;
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
    const commentByPostId: Comments[] = await CommentsModel.find(filter)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();
    const totalCount: number = await CommentsModel.countDocuments(filter);
    const pagesCount: number = await Math.ceil(totalCount / +pageSize);

    const items: CommentView[] = [];

    commentByPostId.forEach(async (item) => {
      const likesInfo = await this.resultLikeProcessing(
        item._id.toString(),
        userId
      );
      const commnent = commentDBToView(item, likesInfo);

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
}
