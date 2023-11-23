import { CommentRepositories } from '../Repositories/comment-db-repositories';
import { LikesModel } from '../db/db';
import { LikeStatusEnum } from '../enum/like-status-enum';
import { CommentView, Comments } from "../types/commentType";
import { ObjectId } from "mongodb";

export class CommentService {
  constructor(protected commentRepositories: CommentRepositories) {}
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
  async updateCommentByCommentId(
    commentId: string,
    content: string
  ): Promise<boolean> {
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
  ): Promise<CommentView | null> {
    const newComment: Comments = {
      _id: new ObjectId(),
      content: content,
      commentatorInfo: {
        userId,
        userLogin,
      },
      postId,
      createdAt: new Date().toISOString(),
	  likesInfo: {
		likesCount: 0,
    	dislikesCount: 0,
    	myStatus: LikeStatusEnum.None
	  }
    };
    console.log(newComment.commentatorInfo);
    return await this.commentRepositories.createNewCommentPostId(newComment);
  }
}

