import { ObjectId } from "mongodb";
import { LikesInfoModel } from "./likesInfoType";

export class Posts {
  public createdAt: string;
  public extendedLikesInfo!: LikesInfoModel;
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
	
  ) {
    this.createdAt = new Date().toISOString();
	this.extendedLikesInfo.dislikesCount = 0;
	this.extendedLikesInfo.likesCount = 0;
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
	
  ) {
    super(title, shortDescription, content, blogId, blogName, 
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