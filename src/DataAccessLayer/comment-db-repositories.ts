import { CommentTypeView } from '../UIRepresentation/types/commentType';
import { PaginationType } from "../UIRepresentation/types/types";
import { CommentType } from "../UIRepresentation/types/commentType";
import { commentCollection } from "../db/db";
import { Filter, ObjectId } from "mongodb";

const commentDBToView = (item: CommentType): CommentTypeView => {
  return {
    id: item._id.toString(),
    content: item.content,
    commentatorInfo: item.commentatorInfo,
    createdAt: item.createdAt,
  };
};
export const commentRepositories = {
  async updateComment(commentId: string, content: string) {
    const updateOne = await commentCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content: content } }
    );
    return updateOne.matchedCount === 1;
  },
  async deleteComment(commentId: string): Promise<boolean> {
    try {
      const deleteComment = await commentCollection.deleteOne({
        _id: new ObjectId(commentId),
      });
      return deleteComment.deletedCount === 1;
    } catch (err) {
      return false;
    }
  },
  async findCommentById(id: string): Promise<CommentTypeView | null> {
    try {
      const commentById: CommentType | null = await commentCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!commentById) {
        return null;
      }
      return commentDBToView(commentById);
    } catch (e) {
      return null;
    }
  },
  async findCommentByPostId(
    postId: string,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
  ): Promise<PaginationType<CommentTypeView> | null> {
    const filter: Filter<CommentType> = { postId: postId };
    const commentByPostId: CommentType[] = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .toArray();
    const totalCount: number = await commentCollection.countDocuments(filter);
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
  },
  async createNewCommentPostId(
    newComment: CommentType
  ): Promise<CommentTypeView> {
    await commentCollection.insertOne({ ...newComment });
    return commentDBToView(newComment);
  },
};
