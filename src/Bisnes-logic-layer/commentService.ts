import { CommentTypeView } from '../UIRepresentation/types/commentType';
import { ObjectId } from "mongodb";
import { commentRepositories } from "../DataAccessLayer/comment-db-repositories";

export const commentService = {
  async updateCommentByCommentId(commentId: string, content: string): Promise<boolean> {
    const updateCommentId = await commentRepositories.updateComment(
      commentId,
      content
    );
    return updateCommentId;
  },
  async createNewCommentByPostId(
    postId: string,
    content: string,
	userId: string,
	userLogin: string
  ): Promise<CommentTypeView | null> {
	
    const newComment = {
      _id: new ObjectId(),
      content: content,
      commentatorInfo: {
        userId,
        userLogin,
      },
	  postId,
      createdAt: new Date().toISOString(),
    };
	console.log((newComment.commentatorInfo))
    return await commentRepositories.createNewCommentPostId(newComment);
  },
};
