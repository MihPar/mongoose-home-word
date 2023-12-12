import { ObjectId } from "mongodb";
import { LikesInfoModel, LikesInfoViewModel, newestLikesType } from "./likesInfoType";
import { LikeStatusEnum } from "../enum/like-status-enum";

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
	this.extendedLikesInfo = {
		dislikesCount: 0,
		likesCount: 0,
		
	}
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
  static getPostsViewModel(post: PostsDB, myStatus: LikeStatusEnum,
	newestLikes: newestLikesType[]): PostsViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
	  extendedLikesInfo: {...post.extendedLikesInfo, myStatus, newestLikes},
    };
  }
  getPostViewModel(myStatus: LikeStatusEnum,
	newestLikes: newestLikesType[]): PostsViewModel {
    return {
      id: this._id.toString(),
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      createdAt: this.createdAt,
	  extendedLikesInfo: {...this.extendedLikesInfo, myStatus, newestLikes},
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
  extendedLikesInfo: LikesInfoViewModel,
};