import { ObjectId } from "mongodb"
import { LikeStatusEnum } from "../enum/like-status-enum";
import { likeInfoType } from "./likesInfoType";

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export class CommentView {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string,
	public likesInfo: likeInfoType
  ) {}
}

export class Comments {
	constructor(
	  public _id: ObjectId,
	  public content: string,
	  public commentatorInfo: CommentatorInfo,
	  public postId: string,
	  public createdAt: string,
	  public likesCount: number,
	  public dislikesCount: number
	) {}
  }