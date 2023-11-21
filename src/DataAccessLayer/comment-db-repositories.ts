import { CommentView, Comments } from '../UI/types/commentType';
import { PaginationType } from './../UI/types/types';
import { CommentsModel } from './../db/db';
import { ObjectId } from "mongodb";


class CommentRepositories {
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
	  async findCommentById(id: string): Promise<CommentView | null> {
		try {
		  const commentById: Comments | null = await CommentsModel.findOne({
			_id: new ObjectId(id),
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
}

const commentDBToView = (item: Comments): CommentView => {
	return {
	  _id: new ObjectId(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	};
  };

  export const commentRepositories = new CommentRepositories()
