import { ObjectId } from "mongodb";

export class Posts {
	public createdAt: string
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
  ) {
	this.createdAt = new Date().toISOString()
  }
}

export class PostsDB extends Posts {
	public _id: ObjectId
	constructor(
	   title: string,
	   shortDescription: string,
	   content: string,
	   blogId: string,
	   blogName: string,
	) {
		super(
			title,
			shortDescription,
			content,
			blogId,
			blogName,
		)
		this._id = new ObjectId()
	}
	getPostsViewModel() {
		return {
			id: this._id.toString(),
			title: this.title,
			shortDescription: this.shortDescription,
			content: this.content,
			blogId: this.blogId,
			blogName: this.blogName,
			createdAt: this.createdAt,
		}
	}
  }

// export type PostsType = {
// 	_id: ObjectId;
// 	title: string;
// 	shortDescription: string;
// 	content: string;
// 	blogId: string;
// 	blogName: string;
// 	createdAt: string;
//   };