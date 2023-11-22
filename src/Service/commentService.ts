import { CommentRepositories } from '../Repositories/comment-db-repositories';
import { CommentView, Comments } from '../types/commentType';
import { ObjectId } from "mongodb";

export class CommentService {
	commentRepositories: CommentRepositories
	constructor() {
		this.commentRepositories = new CommentRepositories() 
	}
	async updateCommentByCommentId(commentId: string, content: string): Promise<boolean> {
		const updateCommentId = await this.commentRepositories.updateComment(
		  commentId,
		  content
		);
		return updateCommentId;
	  }
	  async createNewCommentByPostId(
		postId: string,
		content: string,
		userId: string,
		userLogin: string
	  ): Promise<CommentView| null> {
		
		const newComment: Comments = {
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
		return await this.commentRepositories.createNewCommentPostId(newComment);
	  }
}

// export const commentService = new CommentService()
