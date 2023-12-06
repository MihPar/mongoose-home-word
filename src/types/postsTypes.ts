import { ObjectId } from "mongodb";

export class Posts {
  public createdAt: string;
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string
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
    blogName: string
  ) {
    super(title, shortDescription, content, blogId, blogName);
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
    };
  }
}

// const func = (): PostsDB => {
// 	return }
// }

export type PostsViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};