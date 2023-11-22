import { ObjectId } from "mongodb";

export class Posts {
  constructor(
    public _id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string
  ) {}
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