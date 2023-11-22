import { ObjectId } from "mongodb"
import { LikeStatusEnam } from "../enam/like-status-enum";

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type likeInfoType = {
	likesCount: number
    dislikesCount: number
    myStatus: string
}

export class CommentView {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
	public likeInfo: likeInfoType
  ) {}
}

export class Comments {
	constructor(
	  public _id: ObjectId,
	  public content: string,
	  public commentatorInfo: CommentatorInfo,
	  public postId: string,
	  public createdAt: string,
	) {}
  }

  export type newestLikesType = {
    addedAt: string,
    userId: ObjectId,
    login: string
}

  export class LikesInfoClass {
    constructor(
      public likesCount: number,
      public dislikeCount: number,
      public myStatus: LikeStatusEnam,
	  public newestLike: newestLikesType[]
    ) {}
  }

 