import { ObjectId } from "mongodb";
import { CommentView, Comments } from "../types/commentType";
import { LikeStatusEnum } from "../enum/like-status-enum";

export const commentDBToView = (item: Comments, myStatus: LikeStatusEnum | null): CommentView => {
	return {
	  _id: new ObjectId(),
	  content: item.content,
	  commentatorInfo: item.commentatorInfo,
	  createdAt: item.createdAt,
	  likesInfo: {
		likesCount: item?.likesCount || 0,
    	dislikesCount: item?.dislikesCount || 0,
    	myStatus: myStatus || LikeStatusEnum.None
	  }
	};
  };