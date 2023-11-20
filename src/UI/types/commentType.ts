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
    public createAT: string
  ) {}
}

export class Comment {
	constructor(
	  public _id: ObjectId,
	  public content: string,
	  public commentatorInfo: CommentatorInfo,
	  public postId: string,
	  public createAT: string
	) {}
  }