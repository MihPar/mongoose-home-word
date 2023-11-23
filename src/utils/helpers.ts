import { ObjectId } from "mongodb";
import { CommentView, Comments } from "../types/commentType";
import { LikesInfoClass } from "../types/likesInfoType";
import { LikeStatusEnum } from "../enum/like-status-enum";

export const commentDBToView = (item: Comments, likesInfo?: LikesInfoClass): CommentView => {
	return {
	  _id: new ObjectId(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	  likesInfo: {
		likesCount: likesInfo?.likesCount || 0,
    	dislikesCount: likesInfo?.dislikesCount || 0,
    	myStatus: likesInfo?.myStatus || LikeStatusEnum.None
	  }
	};
  };