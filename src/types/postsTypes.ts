import { ObjectId } from "mongodb";
import { LikesInfoModel } from "./likesInfoType";

export class Posts {
  public createdAt: string;
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
	public extendedLikesInfo: LikesInfoModel
  ) {
    this.createdAt = new Date().toISOString();
  }
}

export class PostsDB extends Posts {
  public _id: ObjectId;
  constructor(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
	extendedLikesInfo:  LikesInfoModel
  ) {
    super(title, shortDescription, content, blogId, blogName, 
		 extendedLikesInfo
		);
    this._id = new ObjectId();
  }
  static getPostsViewModel(post: PostsDB): PostsViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
	  extendedLikesInfo: post.extendedLikesInfo
    };
  }
  getPostViewModel(): PostsViewModel {
    return {
      id: this._id.toString(),
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      createdAt: this.createdAt,
	  extendedLikesInfo: this.extendedLikesInfo
    };
  }
}

export type PostsViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfoModel
};