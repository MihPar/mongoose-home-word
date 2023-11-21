import { ObjectId } from "mongodb"

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export class CommentView {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfo,
    public createdAt: string
  ) {}
}

export class Comments {
	constructor(
	  public _id: ObjectId,
	  public content: string,
	  public commentatorInfo: CommentatorInfo,
	  public postId: string,
	  public createdAt: string
	) {}
  }