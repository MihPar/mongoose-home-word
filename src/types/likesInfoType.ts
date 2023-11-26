import { ObjectId } from "mongodb"
import { LikeStatusEnum } from "../enum/like-status-enum"

export type likeInfoType = {
	likesCount: number
    dislikesCount: number
    myStatus: LikeStatusEnum
}

export class LikesInfoClass {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: LikeStatusEnum
  ) {}
}

  export class Like {
    constructor(
	  public _id: ObjectId,
	  public userId: ObjectId,
	  public commentId: String,
	  public postId: String,
      public myStatus: LikeStatusEnum,
    ) {}
  }
